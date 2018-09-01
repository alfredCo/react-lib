let chaptersService = angular.module("chaptersService", []);
chaptersService.service("chaptersSrv", ["$http" ,function ($http) {
    let static_url = "ailab-manager/v1/";
    return {
        getItemList: function () {
            return $http({
                method: "GET",
                url: static_url + "curriculumChapter"
            });
        },
        createItem: function (data) {
            return $http({
                method: "POST",
                url: static_url + "curriculumChapter",
                data:data
            });
        },
        editItem: function (data) {
            return $http({
                method: "PUT",
                url: static_url + "curriculumChapter",
                data:data
            });
        },
        delItem: function (params) {
            return $http({
                method: "delete",
                url: static_url + `curriculumChapter/${params}`
            });
        },
        getCourseList: function () {
            return $http({
                method: "GET",
                url: static_url + "curriculum"
            });
        },
        getlabconfigsList: function () {
            return $http({
                method: "GET",
                url: static_url + "labconfigs"
            });
        },
        getMarkdownDoc: function (params) {
            return $http({
                method: "GET",
                url: `${static_url}curriculumChapter/resourceFile`,
                params:params
                //url: "/public/tmpl/datestruct.md"
            });
        },
        saveMarkDown: function (id,data) {
            return $http({
                method: "POST",
                url: `${static_url}curriculumChapter/saveMarkDown/${id}`,
                data:data
                //url: "/public/tmpl/datestruct.md"
            });
        }
        
        
    };
}]);
