import "./courselistSrv";
let courselistModule = angular.module("courselistModule", ["courselistService"]);
courselistModule.controller("courselistCtrl", ["$scope", "$translate", "$routeParams", "$timeout", "courselistSrv", "TableCom", "modalCom","$filter", function($scope, $translate, $routeParams, $timeout, Srv, TableCom, modalCom,$filter) {
        var self = $scope;
        
        //table翻译
        self.dataTitles = {
            name: $translate.instant("cn.courselist.dataTitles.name"),
            decr: $translate.instant("cn.courselist.dataTitles.decr"),
            discipline: $translate.instant("cn.courselist.dataTitles.discipline"),
            tag: $translate.instant("cn.courselist.dataTitles.tag"),
            createTime: $translate.instant("cn.courselist.dataTitles.createTime")
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
                        self.canEdit = false;
                        self.canDel = false;
                    }else{
                        self.canEdit = true;
                        self.canDel = true;
                    }
                } else if (self.checkedItems.length == 0) {
                    self.canEdit = false;
                    self.canDel = false;
                } else if (self.checkedItems.length > 1) {
                    self.canEdit = false;
                    self.canDel = true;
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
                        item.tagUseList = item.tagList.map(it=>{return it.name})
                        item.disUseList = item.disciplineList.map(it=>{return it.courseName})
                        item.createTime = $filter("date")(item.createTime, "yyyy-MM-dd HH:mm:ss");
                        item.searchTerm = [item.tagUseList,item.disUseList,item.courseName, item.courseDescription, item.createTime];
                        item.searchTerm = item.searchTerm.join("\b");
                    })
                    TableCom.init(self, "tableParams", self.tableData, "id", 10)
                    if (self.watched) {
                        self.watched();
                    }
                    self.watched = watchCheck(self);
                }
            })
            self.globalSearchTerm = "";
        };

        initList();

        self.refresh = function() {
            initList();
        }
        self.createItem = function(type) {
            modalCom.init('courselistCreate.html', 'courselistCreateCtrl', {
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
        self.uploadImage = function(type){
            modalCom.init('/public/dashboard/tmpl/uploadimg.html', 'uploadImgCtrl', {
                refresh: function() {
                    return self.refresh
                },
                context: function() {
                    return self;
                },
                type: function() {
                    return type;
                },
                data:function(){
                    if(self.checkedItems[0]){
                        return [self.checkedItems[0]]
                    }else{
                        return 'CREATE'
                    }
                }
            })
        }
        
        self.deleteItem = function(checkedItems) {
            self.deleteCheckedItems = checkedItems;
            let content = {
                msg: "您确定要删除所选内容吗？",
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
    }])
    .controller("courselistCreateCtrl", ["$scope", "refresh", "courselistSrv", "$uibModalInstance", "context", "type","$translate", function($scope, refresh, Srv, $uibModalInstance, context, type,$translate) {
        var self = $scope;
        self.canClick = true;
        function init(type) {
            self.repeatName = [];
            self.TITLE = $translate.instant("cn.courselist.model.create");
            self.tagMap = {};
            self.create = {
                name: "",
                decr:'',
                inUseDiscipline:[],
                inUseTags:[],
                allDiscipline:[],
                allTags:[]
            }
            if(context.tableData){
                context.tableData.forEach(item => {
                    self.repeatName.push(item.courseName);
                }) 
            }
            
            if (type == 'edit') {
                self.TITLE = $translate.instant("cn.courselist.model.edit");
                self.create.name = context.checkedItems[0].courseName;
                self.create.decr = context.checkedItems[0].courseDescription;
                self.create.inUseDiscipline = context.checkedItems[0].disciplineList;
                self.create.inUseTags = context.checkedItems[0].tagList;
                self.create.id = context.checkedItems[0].id;
                for (let i = 0; i < self.repeatName.length; i++) {
                    if (self.repeatName[i] == context.checkedItems[0].courseName) {
                        self.repeatName.splice(i, 1);
                    }
                }
            }
        }
        init(type);
        // Srv.getTagList().then(function(res){
        //     if(res&&res.data&&res.data.data){
        //         self.create.allTags = res.data.data;
        //     }
        // })
        Srv.getDisciplineList().then(function(res){
            if(res&&res.data&&res.data.data){
                self.create.allDiscipline = res.data.data;
                self.create.allDiscipline.forEach(item=>{
                    self.tagMap[item.id] = item.tagList;    
                    if(item.tagList){
                        delete item.tagList;
                    }
                })
            }
            if(self.create.inUseDiscipline&&self.create.inUseDiscipline.length>0){
                self.create.inUseDiscipline.forEach(item=>{
                    if(self.tagMap[item.id]&&self.tagMap[item.id].length>0){
                        self.create.allTags.push(...self.tagMap[item.id]);
                    }
                })
            }
            self.create.allTags = _.uniqBy(self.create.allTags,'id');
        })
        self.changeDisc = function(cur){
            self.create.allTags = [];
            cur.forEach(item=>{
                if(self.tagMap[item.id]&&self.tagMap[item.id].length>0){
                    self.create.allTags.push(...self.tagMap[item.id]);
                }
            })
            self.create.allTags = _.uniqBy(self.create.allTags,'id');
            
            if(self.create.inUseTags&&self.create.inUseTags.length>0){
                for(let i=0;i<self.create.inUseTags.length;i++){
                    if(self.create.allTags&&self.create.allTags.length>0){
                        let flag = 0;
                        for(let j=0;j<self.create.allTags.length;j++){
                            if(self.create.inUseTags[i].id==self.create.allTags[j].id){
                                flag = 1;
                                break;
                            }
                        }
                        if(flag!=1){
                            self.create.inUseTags.splice(i,1);
                        }
                    }else{
                        self.create.inUseTags = [];
                    }
                }
            }
        }
        self.changeName = function() {
            self.hadSameName = false;
            for (let i = 0; i < self.repeatName.length; i++) {
                if (self.repeatName[i] == self.create.name) {
                    self.hadSameName = true;
                }
            }
        }
        self.confirmCreate = function(form) {
            self.FormValid = true;
            if (form.$valid&&!self.hadSameName) {
                self.canClick = false;
                //var data = angular.copy(self.create);
                var data = {
                    courseName:self.create.name,
                    courseDescription:self.create.decr,
                    tags:angular.copy(self.create).inUseTags.map(item=>{return item.id}),
                    disciplineIds:angular.copy(self.create).inUseDiscipline.map(item=>{return item.id})
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
export default courselistModule.name;
