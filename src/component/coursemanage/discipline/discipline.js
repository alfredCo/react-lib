import "./disciplineSrv";
let disciplineModule = angular.module("disciplineModule", ["disciplineService"]);
disciplineModule.controller("disciplineCtrl", ["$scope", "$translate", "$routeParams", "$timeout", "disciplineSrv", "TableCom", "modalCom","$filter", function($scope, $translate, $routeParams, $timeout, Srv, TableCom, modalCom,$filter) {
        var self = $scope;
        
        //table翻译
        self.dataTitles = {
            name: $translate.instant("cn.discipline.dataTitles.name"),
            tag: $translate.instant("cn.discipline.dataTitles.tag"),
            createTime: $translate.instant("cn.discipline.dataTitles.createTime"),
            editTime: $translate.instant("cn.discipline.dataTitles.editTime"),
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
            Srv.getItemList().then(function(res) {
                if (res && res.data && res.data.data) {
                    self.tableData = res.data.data;
                    self.tableData.forEach(item => {
                        item.tags = [];
                        item.createTime = $filter("date")(item.createTime, "yyyy-MM-dd HH:mm:ss");
                        item.updateTime = $filter("date")(item.updateTime, "yyyy-MM-dd HH:mm:ss");
                        item.tagList.forEach(it=>{item.tags.push(it.name)})
                        item.searchTerm = [item.courseName, item.createTime,item.tags, item.updateTime];
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
            modalCom.init('disciplineCreate.html', 'disciplineCreateCtrl', {
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
                msg: $translate.instant("cn.discipline.delItem"),
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
    .controller("disciplineCreateCtrl", ["$scope", "refresh", "disciplineSrv", "$uibModalInstance", "context", "type","$translate", function($scope, refresh, Srv, $uibModalInstance, context, type,$translate) {
        var self = $scope;
        self.canClick = true;
        function init(type) {
            self.repeatName = [];
            self.TITLE = $translate.instant("cn.discipline.model.create");
            self.create = {
                name: "",
                inUseTags:[],
                allTags:[]
            }
            if(context.tableData){
                context.tableData.forEach(item => {
                    self.repeatName.push(item.courseName);
                }) 
            }
            if (type == 'edit') {
                self.TITLE = $translate.instant("cn.discipline.model.edit");
                self.canClick = false;
                self.create.name = context.checkedItems[0].courseName;
                self.create.id = context.checkedItems[0].id;
                for (let i = 0; i < self.repeatName.length; i++) {
                    if (self.repeatName[i] == context.checkedItems[0].courseName) {
                        self.repeatName.splice(i, 1);
                    }
                }
                self.create.inUseTags = context.checkedItems[0].tagList;
            }
            Srv.getTagList().then(function(res){
                if(res&&res.data&&res.data.data){
                    self.create.allTags = res.data.data;
                }
            }).finally(function(){
                self.canClick = true;
            })
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
                    courseName:angular.copy(self.create).name,
                    labels:(angular.copy(self.create).inUseTags.map(item=>{return item.id})).join(',')
                }
                if(type == 'edit'){
                    data.id = angular.copy(self.create).id
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
    }]);
export default disciplineModule.name;
