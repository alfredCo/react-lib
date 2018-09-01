let pathlistService = angular.module("pathlistService", []);
pathlistService.service("pathlistSrv", ["$http" ,function ($http) {
    let static_url = "ailab-manager/v1/";
    return {
        getItemList: function () {
            return $http({
                method: "GET",
                url: static_url + "curriculumPath"
            });
        },
        createItem: function (data) {
            return $http({
                method: "POST",
                url: static_url + "curriculumPath",
                data:data
            });
        },
        editItem: function (data) {
            return $http({
                method: "PUT",
                url: static_url + "curriculumPath",
                data:data
            });
        },
        delItem: function (params) {
            return $http({
                method: "delete",
                url: static_url + `curriculumPath/${params}`
            });
        },
        getTagList: function () {
            return $http({
                method: "GET",
                url: static_url + "tag"
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
