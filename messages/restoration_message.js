function message(status, pensioner, ref){
    if(status === "Payment Made"){
        return "Dear" +" " + pensioner +"," + '\n' + "Your Commuted Pension has been restored successfully against your application no" + " " + ref + "." + " " + "Your arrear (if any) will be paid with next month's Pension."
    }
    if(status === "Payment Rejected"){
        return "Dear" +" " + pensioner +"," + '\n' + "Your application for restoration of Commuted Pension against application no" + " " + ref + " " + "has been rejected. Please contact Hooghly Treasury-I for further clarification"
    }
}

module.exports= {message};