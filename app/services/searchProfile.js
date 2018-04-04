
    var searchProfile = function($http){

        function isNumber(n) {
            return !isNaN(parseFloat(n)) && !isNaN(n - 0)
        }

        var getSearchRes = function (query) {
            var res = null;
            if(isNumber(query)){
                res = $http.get("http://localhost:8080/api/v1/student?offset=0&order=vpisnaStevilka&where=vpisnaStevilka:LIKEIC:" + query + "%");
            }
            else{
                res = $http.get("http://localhost:8080/api/v1/student?offset=0&order=vpisnaStevilka&where=priimek:LIKEIC:" + query + "%");
            }

            console.log(res);
            return res;
        };

        // var student = null;
        // var setStudent = function(st){
        //     student = st;
        // };

        var getStudent = function(vpisnaStevilka){
            return $http.get("http://localhost:8080/api/v1/student?where=vpisnaStevilka:EQ:" + vpisnaStevilka );
        };

        return{
            getSearchRes: getSearchRes,
            //setStudent: setStudent,
            getStudent: getStudent
        };
    };

    angular
        .module('studis')
        .service('searchProfile', searchProfile);

