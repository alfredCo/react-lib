let disciplineService = angular.module("disciplineService", []);
disciplineService.service("disciplineSrv", ["$http" ,function ($http) {
    let static_url = "ailab-manager/v1/";
    return {
        getItemList: function () {
            return $http({
                method: "GET",
                url: static_url + "discipline"
            });
        },
        createItem: function (data) {
            return $http({
                method: "POST",
                url: static_url + "discipline",
                data:data
            });
        },
        editItem: function (data) {
            return $http({
                method: "PUT",
                url: static_url + "discipline",
                data:data
            });
        },
        delItem: function (params) {
            return $http({
                method: "delete",
                url: static_url + `discipline/${params}`
            });
        },
        getTagList: function () {
            return $http({
                method: "GET",
                url: static_url + "tag"
            });
        }
    };
}]);
