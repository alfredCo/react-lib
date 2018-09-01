let pathstageService = angular.module("pathstageService", []);
pathstageService.service("pathstageSrv", ["$http" ,function ($http) {
    let static_url = "ailab-manager/v1/";
    return {
        getItemList: function () {
            return $http({
                method: "GET",
                url: static_url + "curriculumStage"
            });
        },
        getPathList: function () {
            return $http({
                method: "GET",
                url: static_url + "curriculumPath"
            });
        },
        createItem: function (data) {
            return $http({
                method: "POST",
                url: static_url + "curriculumStage",
                data:data
            });
        },
        editItem: function (data) {
            return $http({
                method: "PUT",
                url: static_url + "curriculumStage",
                data:data
            });
        },
        delItem: function (params) {
            return $http({
                method: "delete",
                url: static_url + `curriculumStage/${params}`
            });
        },
        getTagList: function () {
            return $http({
                method: "GET",
                url: static_url + "tag"
            });
        },
        getCourseList: function () {
            return $http({
                method: "GET",
                url: static_url + "curriculum"
            });
        },
        getStageCou: function (id) {
            return $http({
                method: "GET",
                url: static_url + `curriculum/${id}`
            });
        },
        allocCou: function (id,data){
            return $http({
                method: "POST",
                url: static_url + `addOrDelCourse/${id}`,
                data:data
            });
        }
    };
}]);
