(function() {

    examAppCtrl.$inject = ["examService", "authentication", "$timeout"];

    function examAppCtrl(examService, authentication, $timeout){
        var vm = this;
        vm.exam = [];
        vm.prijavljenId = [];
        vm.message = null;
        var messageTimer = null;
        var errorMsgTimer = null;

        var messageTimeout = function(){
            $timeout.cancel(messageTimer);
            messageTimer = $timeout(function(){
                vm.message = null;
            }, 5000);
        };

        var errorMsgTimeout = function(){
            $timeout.cancel(errorMsgTimer);
            errorMsgTimer = $timeout(function(){
                vm.errorMsg = null;
            }, 5000);
        };

        examService.getAvailableExams()
            .then(
                function success(response){
                    console.log(response);
                    vm.exams = response.data;
                    angular.forEach(vm.exams, function(exam, key) {
                       var prijavljenRok = exam.prijavljenId;
                       console.log(exam);
                       if (prijavljenRok != null) {
                           angular.forEach(exam.roki, function(rok) {
                               console.log(rok);
                               if (rok.id == prijavljenRok) {
                                   vm.exam[key] = rok;
                               }
                           })
                       }
                    });
                },
                function error(error){
                    console.log(error);
                }
            );


        vm.applyForExam = function(rok, index){
            data = {
                "student": {
                    "id": authentication.currentUser().id
                },
                "rok": {
                    "id": rok
                }
            };
            examService.postExamApplication(data)
                .then(
                    function success(response){
                        console.log(response);
                        vm.exams[index].prijavljen = true;
                        //$('#dateInput').prop('disabled', 'disabled');
                        vm.prijavljenId[index] = response.data.id;
                        vm.message = "Prijava na izpit je bila uspešna";
                        messageTimeout();
                    },
                    function error(error){
                        console.log(error);
                        vm.errorMsg = "Pri prijavi na izpit je prišlo do napake";
                        errorMsgTimeout();
                    }
                )
        };

        vm.cancelExamApplication = function(id, index){
            var data = {
                "student": {
                    "id": authentication.currentUser().id
                },
                "rok": {
                    "id": id == null ? vm.prijavljenId[index] : id
                }
            };
            examService.deleteExamApplication(data)
                .then(
                    function success(response){
                        console.log(response);
                        vm.exams[index].prijavljen = false;
                        //$('#dateInput').prop('disabled', false);
                        vm.prijavljenId[index] = null;
                        vm.message = "Odjava izpita je bila uspešna";
                        messageTimeout();
                    },
                    function error(error){
                        console.log(error);
                        vm.errorMsg = "Pri odjavi izpita je prišlo do napake";
                        errorMsgTimeout();
                    }
                )
        };
    }

    angular
        .module('studis')
        .controller('examAppCtrl', examAppCtrl);
})();