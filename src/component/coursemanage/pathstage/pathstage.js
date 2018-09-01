import "./pathstageSrv";
let pathstageModule = angular.module("pathstageModule", ["pathstageService"]);
pathstageModule.controller("pathstageCtrl", ["$scope", "$translate", "$routeParams", "$timeout", "pathstageSrv", "TableCom", "modalCom","$filter", function($scope, $translate, $routeParams, $timeout, Srv, TableCom, modalCom,$filter) {
        var self = $scope;
        
        //table翻译
        self.dataTitles = {
            name: $translate.instant("cn.pathstage.dataTitles.name"),
            pathname: $translate.instant("cn.pathstage.dataTitles.pathname"),
            sort: $translate.instant("cn.pathstage.dataTitles.sort"),
            createTime: $translate.instant("cn.pathstage.dataTitles.createTime")
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
                self.canManageUser = null;
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
                    self.canEdit = true;
                    self.canDel = true;
                    self.canMoreOpt = true;
                    self.canUploadImg = true;
                } else if (self.checkedItems.length == 0) {
                    self.canEdit = false;
                    self.canDel = false;
                    self.canMoreOpt = false;
                    self.canUploadImg = false;
                } else if (self.checkedItems.length > 1) {
                    self.canEdit = false;
                    self.canDel = true;
                    self.canMoreOpt = false;
                    self.canUploadImg = false;
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
                    self.pathList = [];
                    self.pathMap = [];
                    self.path = {selected:""};
                    self.tableData.forEach(item => {
                        item.createTime = $filter("date")(item.createTime, "yyyy-MM-dd HH:mm:ss");
                        item.searchTerm = [item.pathName, item.stageName,item.stageOrder,item.createTime];
                        item.searchTerm = item.searchTerm.join("\b");
                        if(self.pathMap.indexOf(item.pathId)==-1){
                            self.pathMap.push(item.pathId);
                            self.pathList.push({pathName:item.pathName,id:item.pathId});
                        };
                    })
                    self.pathList.unshift({pathName:$translate.instant("cn.pathstage.allpath"),id:'all'})
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
        self.changePath = function (item) {
            var sourceData = angular.copy(self.tableData);
            self.globalSearchTerm = "";
            self.filterTableData = sourceData.filter(value => {
                if (item.id == "all") {
                    return true;
                } else {
                    if (item.id == value.pathId) {
                        return true;
                    } else {
                        return false;
                    }
                }
            });
            TableCom.init(self, "tableParams", self.filterTableData, "id", 10)
        };
        self.createItem = function(type) {
            modalCom.init('pathstageCreate.html', 'pathstageCreateCtrl', {
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
                msg: $translate.instant("cn.pathstage.delItem"),
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
        self.assignCourse = function(){
            modalCom.init('courseManage.html', 'assignCourseCtrl', {
                refresh: function() {
                    return self.refresh
                },
                context: function() {
                    return self;
                }
            })
        }
    }])
    .controller("pathstageCreateCtrl", ["$scope", "refresh", "pathstageSrv", "$uibModalInstance", "context", "type","$translate", function($scope, refresh, Srv, $uibModalInstance, context, type,$translate) {
        var self = $scope;
        self.canClick = true;
        function init(type) {
            self.repeatName = [];
            self.repeatOrder = [];
            self.TITLE = $translate.instant("cn.pathstage.model.create");
            self.create = {
                stageName: "",
                stageOrder:'',
                pathId:""
            }
            self.pathname = {
                selected:""
            }
            
            if (type == 'edit') {
                self.isEdit = true;
                if(context.tableData){
                    context.tableData.forEach(item => {
                        if(item.pathId==context.checkedItems[0].pathId&&item.stageName!=context.checkedItems[0].stageName){
                            self.repeatName.push(item.stageName);
                        }
                        if(item.pathId==context.checkedItems[0].pathId&&item.stageOrder!=context.checkedItems[0].stageOrder){
                            self.repeatOrder.push(item.stageOrder);
                        }
                    })
                }
                self.TITLE = $translate.instant("cn.pathstage.model.edit");
                self.create.stageName = context.checkedItems[0].stageName;
                self.create.stageOrder = context.checkedItems[0].stageOrder;
                self.create.pathId = context.checkedItems[0].pathId;
                self.create.id = context.checkedItems[0].id;
            }else{
                if(context.tableData){
                    context.tableData.forEach(item => {
                        self.repeatName.push(item.stageName);
                        self.repeatOrder.push(item.stageOrder);
                    })
                }
            }
        }
        init(type);
        self.changePath = function(cur){
            // self.repeatName = [];
            // self.repeatNum = [];
            // if(context.tableData){
            //     context.tableData.forEach(item => {
            //         if(item.pathId==cur.id){
            //             self.repeatName.push(item.stageName);
            //             self.repeatNum.push(item.stageOrder);
            //         }
            //     }) 
            // }
            // self.changeName();

            self.repeatName = [];
            self.repeatOrder = [];
            if(context.tableData){
                context.tableData.forEach(item => {
                    if(item.pathId==cur.id){
                        self.repeatName.push(item.stageName);
                        self.repeatOrder.push(item.stageOrder);
                    }
                })
                if(type == 'edit'&&cur.id==context.checkedItems[0].pathId){
                    for (let i = 0; i < self.repeatName.length; i++) {
                        if (self.repeatName[i] == context.checkedItems[0].stageName) {
                            self.repeatName.splice(i, 1);
                            break;
                        }
                    }
                    for (let i = 0; i < self.repeatOrder.length; i++) {
                        if (self.repeatOrder[i] == context.checkedItems[0].stageOrder) {
                            self.repeatOrder.splice(i, 1);
                            break;
                        }
                    }
                }
            }
            self.changeName('Name',self.create.stageName);
            self.changeName('Order',self.create.stageOrder);

        }
        Srv.getPathList().then(function(res){
            if(res&&res.data&&res.data.data){
                self.pathList = res.data.data;
                if(!self.create.pathId){
                    self.pathname.selected = self.pathList[0];
                    self.changePath(self.pathname.selected);
                }else{
                    for(let i=0;i<self.pathList.length;i++){
                        if(self.create.pathId==self.pathList[i].id){
                            self.pathname.selected = self.pathList[i];
                        }
                    }
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
                self.create.pathId = self.pathname.selected.id;
                var data = angular.copy(self.create);
                if(type == 'edit'){
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
    .controller("assignCourseCtrl", ["$scope", "refresh", "pathstageSrv", "$uibModalInstance", "context","TableCom","$translate", function($scope, refresh, Srv, $uibModalInstance, context,TableCom,$translate) {
        var self = $scope;
        self.canClick = true;
        var curCheckItem = angular.copy(context.checkedItems[0]);
        self.dataTitles = {
            courseName: $translate.instant("cn.pathstage.dataTitles.courseName")
        }
        Srv.getStageCou(curCheckItem.id).then(function(res){
            if(res&&res.data&&res.data.data){
                self.rightTableData = res.data.data;
                TableCom.init(self, "tableRight", self.rightTableData, "id", 10,"rightCheckboxes")
                $(".right-col .table tbody").niceScroll({
                    cursorcolor:"#e5e5e5"
                });
            }
        }).then(function(){
            Srv.getCourseList().then(function(res){
                if(res&&res.data&&res.data.data){
                    self.leftTableData = [];
                    for(let i=0;i<res.data.data.length;i++){
                        var isIn = 1;
                        for(let j=0;j<self.rightTableData.length;j++){
                            if(res.data.data[i].id==self.rightTableData[j].id){
                                isIn = 2;
                                break;
                            }
                        }
                        if(isIn==1){
                            self.leftTableData.push(res.data.data[i])
                        }
                    }
                    TableCom.init(self, "tableLeft", self.leftTableData, "id", 10,"leftCheckboxes")
                    $(".left-col .table tbody").niceScroll({
                        cursorcolor:"#e5e5e5"
                    });
                }
            })
        })
        

        self.leftGlobalSearch = function() {
            var term = self.leftSearchTerm;
            self.tableLeft.filter({ courseName: term });
        };
        self.rightGlobalSearch = function() {
            var term = self.rightSearchTerm;
            self.tableRight.filter({ courseName: term });
        };
        


        self.$watch("leftCheckboxes.items", val => {
            self.leftCheckedItems = [];
            for (var i in val) {
                if (val[i]) {
                    self.tableLeft.data.forEach(item => {
                        if (item.id == i) {
                            self.leftCheckedItems.push(item);
                        }
                    });
                }
            }
            if (self.leftCheckedItems.length >= 1) {
                self.canAddStudent = true;
            } else {
                self.canAddStudent = false;
            }
        },true);
        self.$watch("rightCheckboxes.items", val => {
            self.rightCheckedItems = [];
            for (var i in val) {
                if (val[i]) {
                    self.tableRight.data.forEach(item => {
                        if (item.id == i) {
                            self.rightCheckedItems.push(item);
                        }
                    });
                }
            }
            if (self.rightCheckedItems.length >= 1) {
                self.canRemoveStudent = true;
            } else {
                self.canRemoveStudent = false;
            }
        },true);


        function leftTableSuccess(data) {
            TableCom.init(self, "tableLeft", data, "id", 10, "leftCheckboxes");
        }
        function rightTableSuccess(data){
            TableCom.init(self, "tableRight", data, "id", 10, "rightCheckboxes");
        }

        self.addStudent = function (checkedItems) {
            var map = {};
            var oldleft = angular.copy(self.leftTableData);
            self.leftTableData = [];
            self.temporaryList = [];

            checkedItems.forEach(element => {
                self.rightTableData.push(element);
                self.tableLeft.data.forEach(item => {
                    if (item.id == element.id) {
                        map[item.id] = true;
                    }
                });
            });
            oldleft.forEach(element => {
                if (!map[element.id]) {
                    self.leftTableData.push(element);
                }
            });
            leftTableSuccess(self.leftTableData);
            rightTableSuccess(self.rightTableData);
        }
        self.removeStudent = function (checkedItems) {
            var map = {};
            var oldright = angular.copy(self.rightTableData);
            self.rightTableData = [];
            checkedItems.forEach(element => {
                self.leftTableData.push(element);
                self.tableRight.data.forEach(item => {
                    if (item.id == element.id) {
                        map[item.id] = true;
                    }
                });
            });
            oldright.forEach(element => {
                if (!map[element.id]) {
                    self.rightTableData.push(element);
                }
            });
            leftTableSuccess(self.leftTableData);
            rightTableSuccess(self.rightTableData);
        }
        self.confirmCreate = function(){
            self.canClick = false;
            var inuse = self.tableRight.data.map(item=>{return item.id})
            Srv.allocCou(curCheckItem.id,inuse).then(function(){
                refresh();
                $uibModalInstance.close();
            }).finally(function(){
                self.canClick = true;
            })
        }

    }]);
export default pathstageModule.name;
