var connToken = "90938682|-31949294602845254|90942631";
var baseURL = "http://api.login2explore.com:5577";
var db = "Employee";
var response;

function execute(req, endpoint) {
    jQuery.ajaxSetup({ async: false });
    var res = executeCommandAtGivenBaseUrl(req, baseURL, endpoint);
    return res;
}

function validateData() {
    var empId = $("#eID").val();
    if (empId === "") {
        alert("Employee ID Value Required!");
        $("#eId").focus();
        return "";
    }
    var empName = $("#eName").val();
    if (empName === "") {
        alert("Employee Name is a Required Value!");
        $("#eName").focus();
        return "";
    }
    var empEmail = $("#eSalary").val();
    if (empEmail === "") {
        alert("Salary Value Required!");
        $("#empEmail").focus();
        return "";
    }
    var empHRA = $("#eHRA").val();
    if (empHRA === "") {
        alert("HRA Value Required!");
        $("#empEmail").focus();
        return "";
    }

    var empDA = $("#eDA").val();
    if (empDA === "") {
        alert("DA Value Required!");
        $("#empEmail").focus();
        return "";
    }

    var empDeduct = $("#eDeduct").val();
    if (empDeduct === "") {
        alert("Deduction Value Required!");
        $("#empEmail").focus();
        return "";
    }
    var jsonStrObj = {
        eID: empId,
        eName: empName,
        eSalary: empEmail,
        eHRA: empHRA,
        eDA: empDA,
        eDeduct: empDeduct
    };
    return JSON.stringify(jsonStrObj);
}

function initForm() {
    localStorage.removeItem("first_rec_no");
    localStorage.removeItem("last_rec_no");
    localStorage.removeItem("rec_no");
}

function setFirstRec(response) {
    var resp = JSON.parse(response.data);
    // console.log(typeof (data.rec_no));
    if (resp.rec_no === '') {
        localStorage.setItem("first_rec_no", "0");
    } else {
        localStorage.setItem('first_rec_no', resp.rec_no);
    }
}

function firstRec() {
    var getFirst = createFIRST_RECORDRequest(connToken, db, "form");
    var response = execute(getFirst, "/api/irl");
    fillData(response);
    setFirstRec(response);
    jQuery.ajaxSetup({ async: true });
    document.getElementById("eID").disabled = true;
    document.getElementById("first").disabled = true;
    document.getElementById("previous").disabled = true;
    document.getElementById("submit").disabled = true;
    document.getElementById("next").disabled = false;
}

function getFirstRec() {
    return localStorage.getItem('first_rec_no');
}

function setLastRec(response) {
    var data = JSON.parse(response.data);
    if (data.rec_no === '') {
        localStorage.setItem("last_rec_no", "0");
    } else {
        localStorage.setItem('last_rec_no', data.rec_no);
    }
}

function lastRec() {
    var getLast = createLAST_RECORDRequest(connToken, db, "form");
    var response = execute(getLast, "/api/irl");
    setLastRec(response);
    fillData(response);
    jQuery.ajaxSetup({ async: true });
    document.getElementById("first").disabled = false;
    document.getElementById("previous").disabled = false;
    document.getElementById("submit").disabled = true;
    document.getElementById("last").disabled = true;
    document.getElementById("next").disabled = true;
}

function getLastRec() {
    return localStorage.getItem('last_rec_no');
}

function oneRec() {
    if (localStorage.getItem("first_rec_no") === localStorage.getItem("last_rec_no")) {
        return true;
    }
    return false;
}

function noRec() {
    if (localStorage.getItem('last_rec_no') === '0' && localStorage.getItem('first_rec_no') === '0') {
        return true;
    }
    return false;
}

function checkOneorNoRec() {
    if (noRec()) {
        document.querySelectorAll("input").forEach(e => e.disabled = true);
        document.getElementById("new").disabled = false;
    }
    if (oneRec()) {
        document.querySelectorAll("input").forEach(e => e.disabled = true);
        document.getElementById("new").disabled = false;
        document.getElementById("edit").disabled = false;
    }
}

function prevRec() {
    var record = localStorage.getItem('rec_no');
    if (record === 1) {
        $("#previous").prop("disabled", true);
        $("#first").prop("disabled", true);
    }

    var prevReq = createPREV_RECORDRequest(connToken, db, "form", record);
    var response = execute(prevReq, "/api/irl");
    fillData(response);
    jQuery.ajaxSetup({ async: true });

    if (record === 1) {
        $("#previous").prop("disabled", true);
        $("#first").prop("disabled", true);
    }
    $("#submit").prop("disabled", true);
}

function nextRec() {
    var record = localStorage.getItem('rec_no');
    var nextReq = createNEXT_RECORDRequest(connToken, db, "form", record);
    var response = execute(nextReq, "/api/irl");
    $("#submit").prop("disabled", true);
    fillData(response);
    jQuery.ajaxSetup({ async: true });
}

function resetForm() {
    document.querySelectorAll(".fb").forEach(e => e.disabled = true);
    document.querySelectorAll(".nb").forEach(e => e.disabled = false);
    var getReq = createGET_BY_RECORDRequest(connToken, db, "form", getCurrRec());
    var response = execute(getReq, "/api/irl");
    fillData(response);
    jQuery.ajaxSetup({ async: true });
    if (oneRec() || noRec()) {
        $(".nb").prop("disabled", true);
    }
    document.getElementById("new").disabled = false;
    if (noRec()) {
        $(".form-control").val("");
        document.getElementById("edit").disabled = true;
    } else {
        document.getElementById("edit").disabled = false;
    }
    $(".form-control").prop("disabled", true);
}

function setCurrRec(response) {
    var resp = JSON.parse(response.data);
    localStorage.setItem("rec_no", resp.rec_no);
}

function getCurrRec() {
    return localStorage.getItem("rec_no");
}

function fillData(response) {
    setCurrRec(response);
    var rec = JSON.parse(response.data).record;
    $("#eID").val(rec.eID);
    $("#eName").val(rec.eName);
    $("#eSalary").val(rec.eSalary);
    $("#eHRA").val(rec.eHRA);
    $("#eDA").val(rec.eDA);
    $("#eDeduct").val(rec.eDeduct);
    document.querySelectorAll(".nb").forEach(e => e.disabled = false);
    document.querySelectorAll(".form-control").forEach(e => e.disabled = true);
    $("#submit").prop("disabled", true);
    $("#update").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#new").prop("disabled", false);
    $("#edit").prop("disabled", false);
    if (getCurrRec() === getLastRec()) {
        $("#next").prop("disabled", true);
        $("#last").prop("disabled", true);
    }
    if (getCurrRec() === getFirstRec()) {
        $("#first").prop("disabled", true);
        $("#previous").prop("disabled", true);
    }
}

function getEmp() {
    var empId = $("#eID").val();
    if (empId.value == "") {

    } else {
        var jsonStr = { eID: empId };
        jsonObjStr = JSON.stringify(jsonStr);

        var getReq = createGET_BY_KEYRequest(connToken, db, "form", jsonObjStr);
        var response = execute(getReq, "/api/irl");
        document.getElementById('reset').disabled = false;

        if (response.status == 200) {
            fillData(response);
            document.getElementById('submit').disabled = true;
            document.getElementById('edit').disabled = false;
            document.querySelectorAll(".form-control:not(#eID)").forEach(e => e.disabled = true);
        }
        else if (response.status == 400) {
            document.getElementById('edit').disabled = true;
            document.getElementById('submit').disabled = false;
        } else {
            alert("Error " + response.status + '!');
        }
        jQuery.ajaxSetup({ async: true });
    }
}

function submitData() {
    var jsonStr = validateData();
    var putReq = createPUTRequest(connToken, jsonStr, db, "form");
    var response = execute(putReq, "/api/iml");
    if (noRec()) {
        setFirstRec(response);
    }
    setLastRec(response);
    setCurrRec(response);
    jQuery.ajaxSetup({ async: true });
    resetForm();
}

function updateData() {
    var jsonStr = validateData();
    var updateReq = createUPDATERecordRequest(connToken, jsonStr, db, "form", getCurrRec());
    var response = execute(updateReq, "/api/iml");
    // console.log("updatedata response " + response.status);
    resetForm();
    jQuery.ajaxSetup({ async: true });
}

function editForm() {
    $(".form-control").prop("disabled", false);
    document.getElementById("eID").disabled = true;
    document.getElementById("eName").focus();
    $(".btn").prop("disabled", true);
    document.getElementById("update").disabled = false;
    document.getElementById("reset").disabled = false;
}

function newForm() {
    $(".form-control").val("");
    document.querySelectorAll(".form-control").forEach(e => e.disabled = false);
    document.querySelectorAll(".btn").forEach(e => e.disabled = true);
    document.getElementById("submit").disabled = false;
    document.getElementById("reset").disabled = false
    $("#eID").focus();
}


function onr() {
    initForm();
    firstRec();
    lastRec();
    checkOneorNoRec();
}

