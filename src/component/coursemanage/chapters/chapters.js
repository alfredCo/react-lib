import "./chaptersSrv";
import readFileMd from "../../../../common/service/readFilePreview"
let chaptersModule = angular.module("chaptersModule", ["chaptersService"]);
chaptersModule.controller("chaptersCtrl", ["$scope", "$translate","$location","$timeout", "chaptersSrv", "TableCom", "modalCom","$filter", function($scope, $translate, $location,$timeout, Srv, TableCom, modalCom,$filter) {
        var self = $scope;
        
        //table翻译
        self.dataTitles = {
            name: $translate.instant("cn.chapters.dataTitles.name"),
            courseName: $translate.instant("cn.chapters.dataTitles.courseName"),
            sort: $translate.instant("cn.chapters.dataTitles.sort"),
            libImg: $translate.instant("cn.chapters.dataTitles.libImg"),
            createTime: $translate.instant("cn.chapters.dataTitles.createTime")
        }
        self.watched = '';


        //监听checkbox
        function watchCheck(self) {
            var watch = self.$watch(function() {
                return self.checkboxes.items;
            }, function(val) {
                self.checkedItems = [];
                var arr = [];
                for (var i in self.checkboxes.items) {
                    arr.push(self.checkboxes.items[i]);
                }
                self.canEdit = null;
                self.canDel = null;
                if (val && arr.length >= 0) {
                    for (var key in val) {
                        if (val[key]) {
                            self.tableData.forEach(item => {
                                if (item.id == key) {
                                    self.checkedItems.push(item);
                                }
                            });
                        }
                    }
                }
                if (self.checkedItems.length == 1) {
                    if(self.checkedItems[0].status==1){
                        self.canDel = false;
                    }else{
                        self.canDel = true;
                    }
                    self.canEdit = true;
                    self.canRead = true
                } else if (self.checkedItems.length == 0) {
                    self.canEdit = false;
                    self.canDel = false;
                    self.canRead = false;
                } else if (self.checkedItems.length > 1) {
                    self.canEdit = false;
                    self.canDel = true;
                    self.canRead = false;
                    for(let i=0;i<self.checkedItems.length;i++){
                        if(self.checkedItems[i].status==1){
                            self.canDel = false;
                            break;
                        }
                    }
                }
            }, true);
            return watch;
        }

        self.applyGlobalSearch = function() {
            var term = self.globalSearchTerm;
            self.tableParams.filter({ searchTerm: term });
        };

        function initList() {
            Srv.getItemList().then(function(res) {
                if (res && res.data && res.data.data) {
                    self.tableData = res.data.data;
                    self.tableData.forEach(item => {
                        item.chapterOrder = Number(item.chapterOrder);
                        item.createTime = $filter("date")(item.createTime, "yyyy-MM-dd HH:mm:ss");
                        item.searchTerm = [item.courseName, item.chapterName,item.chapterOrder,item.experimentMirror,item.createTime];
                        item.searchTerm = item.searchTerm.join("\b");
                    })
                    TableCom.init(self, "tableParams", self.tableData, "id", 10)
                    if (self.watched) {
                        self.watched();
                    }
                    self.curriculumList = [];
                    self.curriculumMap = [];
                    self.curriculum = {selected:""};
                    self.watched = watchCheck(self);
                    self.tableData.forEach(item=>{
                        if(self.curriculumMap.indexOf(item.curriculumId)==-1){
                            self.curriculumMap.push(item.curriculumId);
                            self.curriculumList.push({courseName:item.courseName,id:item.curriculumId})
                        };
                    })
                    self.curriculumList.unshift({courseName:$translate.instant("cn.chapters.allcourse"),id:'all'})
                }
            })
            self.globalSearchTerm = "";
        };

        initList();
        self.changeCurriculum = function (item) {
            var sourceData = angular.copy(self.tableData);
            self.globalSearchTerm = "";
            self.filterTableData = sourceData.filter(value => {
                if (item.id == "all") {
                    return true;
                } else {
                    if (item.courseName == value.courseName) {
                        return true;
                    } else {
                        return false;
                    }
                }
            });
            TableCom.init(self, "tableParams", self.filterTableData, "id", 10)
        };
        self.refresh = function() {
            initList();
        }
        self.createItem = function(type) {
            modalCom.init('chaptersCreate.html', 'chaptersCreateCtrl', {
                refresh: function() {
                    return self.refresh
                },
                context: function() {
                    return self;
                },
                type: function() {
                    return type;
                }
            })
        }
        
        self.deleteItem = function(checkedItems) {
            self.deleteCheckedItems = checkedItems;
            let content = {
                msg: $translate.instant("cn.chapters.delItem"),
                type: "warning",
                func: "confirmDeleteItem"
            };
            self.$emit("ui-tag-alert", content);
        };
        self.confirmDeleteItem = function() {
            var data = self.deleteCheckedItems.map(item=>{return item.id})
            data = data.join(",")
            Srv.delItem(data).then(() => {
                initList();
            });
        };
        self.editDoc = function(checkedItems){
            var id = checkedItems[0].id;
            $location.url(`/coursemanage/chapters/${id}?name=${checkedItems[0].mdUrl}&status=${checkedItems[0].status}`);
        }
    }])
    .controller("chaptersCreateCtrl", ["$scope", "refresh", "chaptersSrv", "$uibModalInstance", "context", "type","$translate", function($scope, refresh, Srv, $uibModalInstance, context, type,$translate) {
        var self = $scope;
        self.canClick = true;
        function init(type) {
            self.repeatName = [];
            self.repeatOrder = [];
            self.TITLE = $translate.instant("cn.chapters.model.create");
            self.create = {
                name: "",
                decr:'',
                chapterOrder:"",
                allCourse:[],
                courseSelected:"",
                curriculumId:'',
                allExperimentMirror:[],
                libImgSelected:{},
                labconfigId:""
            }
            
            
            if (type == 'edit') {
                self.TITLE = $translate.instant("cn.chapters.model.edit");
                if(context.tableData){
                    context.tableData.forEach(item => {
                        if(item.curriculumId==context.checkedItems[0].curriculumId&&item.chapterName!=context.checkedItems[0].chapterName){
                            self.repeatName.push(item.chapterName);
                        }
                        if(item.curriculumId==context.checkedItems[0].curriculumId&&item.chapterOrder!=context.checkedItems[0].chapterOrder){
                            self.repeatOrder.push(item.chapterOrder);
                        }
                    }) 
                }
                if(context.checkedItems[0].status==1){
                    self.isDefault = true;
                }
                self.isEdit = true;
                self.create.name = context.checkedItems[0].chapterName;
                self.create.chapterOrder = context.checkedItems[0].chapterOrder;
                self.create.decr = context.checkedItems[0].courseDescription;
                self.create.curriculumId = context.checkedItems[0].curriculumId;
                self.create.id = context.checkedItems[0].id;
                self.create.labconfigId = context.checkedItems[0].labconfigId;
                self.create.experimentMirror = context.checkedItems[0].experimentMirror;
            }else{
                if(context.tableData){
                    context.tableData.forEach(item => {
                        self.repeatName.push(item.chapterName);
                        self.repeatOrder.push(item.chapterOrder);
                    }) 
                }
            }
        }
        init(type);
        self.changeCourse = function(cur){
            self.repeatName = [];
            self.repeatOrder = [];
            if(context.tableData){
                context.tableData.forEach(item => {
                    if(item.curriculumId==cur.id){
                        self.repeatName.push(item.chapterName);
                        self.repeatOrder.push(item.chapterOrder);
                    }
                }) 
                if(type == 'edit'&&cur.id==context.checkedItems[0].curriculumId){
                    for (let i = 0; i < self.repeatName.length; i++) {
                        if (self.repeatName[i] == context.checkedItems[0].chapterName) {
                            self.repeatName.splice(i, 1);
                            break;
                        }
                    }
                    for (let i = 0; i < self.repeatOrder.length; i++) {
                        if (self.repeatOrder[i] == context.checkedItems[0].chapterOrder) {
                            self.repeatOrder.splice(i, 1);
                            break;
                        }
                    }
                }
            }
            self.changeName('Name',self.create.name);
            self.changeName('Order',self.create.chapterOrder);
        }
        Srv.getCourseList().then(function(res){
            if(res&&res.data&&res.data.data){
                self.create.allCourse = res.data.data.filter(item=>{return item.status!=1});
                if(self.create.curriculumId){
                    for(let i=0;i<self.create.allCourse.length;i++){
                        if(self.create.allCourse[i].id==self.create.curriculumId){
                            self.create.courseSelected = self.create.allCourse[i];
                            break;
                        }
                    }
                }else{
                    self.create.courseSelected = self.create.allCourse[0];
                    self.changeCourse(self.create.courseSelected);
                }
            }
        })
        Srv.getlabconfigsList().then(function(res){
            if(res&&res.data&&res.data.data){
                self.create.allExperimentMirror = res.data.data;
                //if(self.create.labconfigId){
                if(self.create.experimentMirror){
                    for(let i=0;i<self.create.allExperimentMirror.length;i++){
                        //if(self.create.allExperimentMirror[i].id==self.create.experimentMirrorId){
                        if(self.create.allExperimentMirror[i].configname==self.create.experimentMirror){
                            self.create.libImgSelected = self.create.allExperimentMirror[i];
                            break;
                        }
                    }
                }else{
                    self.create.libImgSelected = self.create.allExperimentMirror[0]
                }
            }
        })
        self.changeName = function(type,val) {
            self['hadSame'+type] = false;
            for (let i = 0; i < self["repeat"+type].length; i++) {
                if (self["repeat"+type][i] == val) {
                    self['hadSame'+type] = true;
                    break;
                }
            }
        }
        self.confirmCreate = function(form) {
            self.FormValid = true;
            if (form.$valid&&!self.hadSameName&&!self.hadSameOrder) {
                self.canClick = false;
                //var data = angular.copy(self.create);
                var data = {
                    chapterName:self.create.name,
                    chapterOrder:self.create.chapterOrder,
                    curriculumId:self.create.courseSelected.id,
                    labconfigId:self.create.libImgSelected?self.create.libImgSelected.id:''
                }
                if(type == 'edit'){
                    data.id = self.create.id;
                    Srv.editItem(data).then(function() {
                        refresh();
                        $uibModalInstance.close();
                    }).finally(function(){
                        self.canClick = true;
                    })
                }else{
                    Srv.createItem(data).then(function() {
                        refresh();
                        $uibModalInstance.close();
                    }).finally(function(){
                        self.canClick = true;
                    })
                }
            }
        }
        
    }])
    .controller("editDocCtrl",["$scope","$routeParams","chaptersSrv","$location","modalCom",function(scope,$routeParams,Srv,$location,modalCom){
        var self = scope;
        if(!$routeParams.id){
            return;
        }
        

        
        
        // self.importFile = function(type) {
        //     modalCom.init('importfile.html', 'importFileCtrl', {
        //         context: function() {
        //             return self;
        //         }
        //     })
        // }
        function init(self,$location,Srv){
            self.currentEditor = {
                instan:""
            }
            
            //判断是否是内置课程 1:yes,内置课程只读
            if($location.search().status==1){
                self.type = 1
            }else{
                self.type = 0;
            }

            //判断是否有md文件传入
            if($location.search().name=='null'){
                self.docData = "markdown complete";
                self.showMarkdown = true;
                self.canSave = true;
            }else{
                let docParam = {
                    fileName:decodeURI($location.search().name)
                    //fileName:'3067fa8935224fe582fe9494f030110a.md'
                }
                Srv.getMarkdownDoc(docParam).then(function(res){
                    if(res&&res.data&&res.data.data){
                        self.docData = res.data.data;
                        self.showMarkdown = true;
                        self.canSave = true;
                    }
                })
            }
        }
        init(self,$location,Srv);
        self.saveForm = function(){
            self.markdownChange(self.currentEditor.instan);
            if(!self.markdownChecked){
                self.canSave = false;
                self.content = self.currentEditor.instan.getMarkdown();
                Srv.saveMarkDown($routeParams.id,{content:self.content}).then(function(res){
                    //$route.reload();
                    //console.log(res.data.data.data.data);
                    $location.search("name",encodeURI(`/download/${res.data.data}`));
                }).finally(function(){
                    self.canSave = true;
                })
            }
            
        }
        
        self.fileChanged = function(e){
            readFileMd(self,e,'md');
        }
        self.markdownChange = function(markdown){
            if(!markdown.getMarkdown().replace(/^\s+|\s+$/g,"")||markdown.getMarkdown().length>10000){
                self.markdownChecked = true;
            }else{
                self.markdownChecked = false;
            }
        }
    }])
    .controller("importFileCtrl",["$scope","context","$route",function($scope,context,$route){
        var self = $scope;
        var reg = /\.md$/;

        self.canClick = true;
        self.modelApiUrl = null;
        self.imgChecked = true;

        self.fileChanged = function(e) {
            var file = e.files[0];
            self.filePath = file.name;
            if (file && reg.test(file.name)) {
                self.imgChecked = false;
            } else {
                self.imgChecked = true;
            }
            self.$apply();
        }
        self.upload = function(uploadimgform){
            self.FormValid = true;
            if(!self.imgChecked&&uploadimgform.$valid){
                self.canClick = false;

                let form = document.forms.namedItem("uploadimgform");
                let oData = new FormData(form);
                let oReq = new XMLHttpRequest();
                let auth_token = localStorage.$LIB_AUTH_TOKEN;
                
                oReq.onerror = function(e) {
                    $rootScope.$apply(function() {
                        self.noUpload = false;
                        $rootScope.$broadcast("ui-tag-bubble", { type: "error", code: 1 });
                    });
                };

                oReq.onload = function() {
                    self.canClick = true;
                    if (oReq.status == 200) {
                        $rootScope.$apply(function() {
                            $rootScope.$broadcast("ui-tag-bubble",{type:"success",code:0});
                            $route.reload();
                        });
                    }
                    self.$apply();
                }
                
                oReq.open("POST", self.modelApiUrl, true);
                oReq.setRequestHeader("X-Auth-Token", auth_token);
                oReq.send(oData);
            }
        }
    }])

export default chaptersModule.name;
