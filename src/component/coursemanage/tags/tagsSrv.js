let tagsService = angular.module("tagsService", []);
tagsService.service("tagsSrv", ["$http" ,function ($http) {
    let static_url = "ailab-manager/v1/";
    return {
        getTagsList: function () {
            return $http({
                method: "GET",
                url: static_url + "tag"
            });
        },
        createTag: function (data) {
            return $http({
                method: "POST",
                url: static_url + "tag",
                data:data
            });
        },
        editTag: function (params) {
            return $http({
                method: "PUT",
                url: static_url + "tag",
                data:params
            });
        },
        delTags: function (params) {
            return $http({
                method: "delete",
                url: static_url + `tag/${params}`
            });
        }
    };
}]);
