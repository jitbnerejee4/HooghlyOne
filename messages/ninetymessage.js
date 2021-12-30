function message(status, pensioner, ref){
    if(status === "Payment Made"){
        return "Dear" +" " + pensioner +"," + '\n' + "The payment for 90 years age benefit has been paid successfully against your application no" + " " + ref + "." + " " + "Your arrear (if any) will be paid along with next month's Pension."
    }
    if(status === "Payment Rejected"){
        return "Dear" +" " + pensioner +"," + '\n' + "Your application 90 years age benefit against application no" + " " + ref + " " + "has been rejected. Please contact Hooghly Treasury-I for further clarification."
    }
}
module.exports = {message};