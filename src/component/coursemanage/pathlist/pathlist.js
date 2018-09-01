import "./pathlistSrv";
import uploadImg from "../../../../common/service/uploadImg";
let pathlistModule = angular.module("pathlistModule", ["pathlistService"]);
pathlistModule.controller("pathlistCtrl", ["$scope", "$translate", "$routeParams", "$timeout", "pathlistSrv", "TableCom", "modalCom","$filter", function($scope, $translate, $routeParams, $timeout, Srv, TableCom, modalCom,$filter) {
        var self = $scope;
        
        //table翻译
        self.dataTitles = {
            name: $translate.instant("cn.pathlist.dataTitles.name"),
            decr: $translate.instant("cn.pathlist.dataTitles.decr"),
            createTime: $translate.instant("cn.pathlist.dataTitles.createTime")
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
                    self.tableData.forEach(item => {
                        item.createTime = $filter("date")(item.createTime, "yyyy-MM-dd HH:mm:ss");
                        item.searchTerm = [item.pathName, item.routeDescription, item.createTime];
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
            modalCom.init('pathlistCreate.html', 'pathlistCreateCtrl', {
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
    .controller("pathlistCreateCtrl", ["$scope", "refresh", "pathlistSrv", "$uibModalInstance", "context", "type","$translate", function($scope, refresh, Srv, $uibModalInstance, context, type,$translate) {
        var self = $scope;
        self.canClick = true;
        function init(type) {
            self.repeatName = [];
            self.TITLE = $translate.instant("cn.pathlist.model.create");
            self.create = {
                pathName: "",
                routeDescription:''
            }
            if(context.tableData){
                context.tableData.forEach(item => {
                    self.repeatName.push(item.pathName);
                }) 
            }
            
            if (type == 'edit') {
                self.TITLE = $translate.instant("cn.pathlist.model.edit");
                self.create.pathName = context.checkedItems[0].pathName;
                self.create.routeDescription = context.checkedItems[0].routeDescription;
                self.create.id = context.checkedItems[0].id;
                for (let i = 0; i < self.repeatName.length; i++) {
                    if (self.repeatName[i] == context.checkedItems[0].pathName) {
                        self.repeatName.splice(i, 1);
                    }
                }
            }
        }

        self.changeName = function() {
            self.hadSameName = false;
            for (let i = 0; i < self.repeatName.length; i++) {
                if (self.repeatName[i] == self.create.pathName) {
                    self.hadSameName = true;
                }
            }
        }
        self.confirmCreate = function(form) {
            self.FormValid = true;
            if (form.$valid&&!self.hadSameName) {
                self.canClick = false;
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
        init(type);
    }])
    .controller("uploadImgCtrl",uploadImg);
export default pathlistModule.name;
