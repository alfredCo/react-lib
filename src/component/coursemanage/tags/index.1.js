import "./tagsSrv";
let tagsModule = angular.module("tagsModule", ["tagsService"]);
tagsModule.controller("tagsCtrl", ["$scope", "$translate", "$routeParams", "$timeout", "tagsSrv", "TableCom", "modalCom","$filter", 
    function($scope, $translate, $routeParams, $timeout, tagsSrv, TableCom, modalCom,$filter) {
        var self = $scope;
        //table翻译
        self.dataTitles = {
            name: $translate.instant("cn.tags.dataTitles.name"),
            createTime: $translate.instant("cn.tags.dataTitles.createTime"),
            editTime: $translate.instant("cn.tags.dataTitles.editTime"),
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
                } else if (self.checkedItems.length == 0) {
                    self.canEdit = false;
                    self.canDel = false;
                } else if (self.checkedItems.length > 1) {
                    self.canEdit = false;
                    self.canDel = true;
                }
            }, true);
            return watch;
        }

        self.applyGlobalSearch = function() {
            var term = self.globalSearchTerm;
            self.tableParams.filter({ searchTerm: term });
        };

        function initList() {
            tagsSrv.getTagsList().then(function(res) {
                if (res && res.data && res.data.data) {
                    self.tableData = res.data.data;
                    self.tableData.forEach(item => {
                        item.createTime = $filter("date")(item.createTime, "yyyy-MM-dd HH:mm:ss");
                        item.updateTime = $filter("date")(item.updateTime, "yyyy-MM-dd HH:mm:ss");
                        item.searchTerm = [item.name, item.createTime, item.updateTime];
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
            modalCom.init('tagCreate.html', 'tagCreateCtrl', {
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
            self.deleteCheckedItems = angular.copy(checkedItems);
            let content = {
                msg: "确定要删除所选标签吗？",
                type: "warning",
                func: "confirmDeleteItem"
            };
            self.$emit("ui-tag-alert", content);
        };
        self.confirmDeleteItem = function() {
            var data = self.deleteCheckedItems.map(item=>{return item.id})
            data = data.join(",")
            tagsSrv.delTags(data).then(() => {
                initList();
            });
        };
    }])
    .controller("tagCreateCtrl", ["$scope", "refresh", "tagsSrv", "$uibModalInstance", "context", "type","$translate", function($scope, refresh, tagsSrv, $uibModalInstance, context, type,$translate) {
        var self = $scope;
        self.canClick = true;
        function init(type) {
            self.repeatName = [];
            self.TITLE = $translate.instant("cn.tags.model.create");
            self.create = {
                name: ""
            }
            if(context.tableData){
                context.tableData.forEach(item => {
                    self.repeatName.push(item.name);
                })
            }
            if (type == 'edit') {
                self.TITLE = $translate.instant("cn.tags.model.edit");
                self.create.name = context.checkedItems[0].name;
                self.create.id = context.checkedItems[0].id;
                for (let i = 0; i < self.repeatName.length; i++) {
                    if (self.repeatName[i] == context.checkedItems[0].name) {
                        self.repeatName.splice(i, 1);
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
                var data = angular.copy(self.create)
                if(type == 'edit'){
                    tagsSrv.editTag(data).then(function() {
                        refresh();
                        $uibModalInstance.close();
                    }).finally(function(){
                        self.canClick = true;
                    })
                }else{
                    tagsSrv.createTag(data).then(function() {
                        refresh();
                        $uibModalInstance.close();
                    }).finally(function(){
                        self.canClick = true;
                    })
                }
            }
        }
        init(type);
    }]);
export default tagsModule.name;
