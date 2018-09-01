let courselistService = angular.module("courselistService", []);
courselistService.service("courselistSrv", ["$http" ,function ($http) {
    let static_url = "ailab-manager/v1/";
    return {
        getItemList: function () {
            return $http({
                method: "GET",
                url: static_url + "curriculum"
            });
        },
        createItem: function (data) {
            return $http({
                method: "POST",
                url: static_url + "curriculum",
                data:data
            });
        },
        editItem: function (data) {
            return $http({
                method: "PUT",
                url: static_url + "curriculum",
                data:data
            });
        },
        delItem: function (params) {
            return $http({
                method: "delete",
                url: static_url + `curriculum/${params}`
            });
        },
        getTagList: function () {
            return $http({
                method: "GET",
                url: static_url + "tag"
            });
        },
        getDisciplineList: function () {
            return $http({
                method: "GET",
                url: static_url + "discipline"
            });
        },
        uploadImageThumb: function (params) {
            return $http({
                method: "delete",
                url: static_url + "monitor/cluster/gpu",
                params:params
            });
        },
        uploadImageBg: function (params) {
            return $http({
                method: "delete",
                url: static_url + "monitor/cluster/gpu",
                params:params
            });
        }
    };
}]);
