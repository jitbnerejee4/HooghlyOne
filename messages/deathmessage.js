function message(status, applicant, pensioner, ref){
    if(status === 'Pension Stopped'){
        return'dear'+ ' '+ applicant +','+ '\n'+ 'Pension of' + ' '+pensioner+ ' '+'has been stopped as per your application, reference number'+ ' ' +ref+'.' + 'You will be contacted via SMS for further correspondence.';
    }
    else if( status === 'Refund Letter Issued'){
        return 'dear'+ ' '+ applicant +','+ '\n'+ 'refund letter issued to concerned bank for refund of excess payment paid to' + ' '+pensioner+ ' '+'against your application reference number'+ ' ' +ref+'.' + 'You will be contacted via SMS for further correspondence.'; 
    }
    else if(status === 'Refund Received'){
        return 'dear'+ ' '+ applicant +','+ '\n'+ 'refund amount has been received from concerned bank of' + ' '+pensioner+ ' '+'against your application reference number'+ ' ' +ref+'.' + 'You will be contacted via SMS for further correspondence.';
    }
    else if(status === 'Challan Issued' || status === 'No Refund'){
        return 'dear'+ ' '+ applicant +','+ '\n'+ ' In Connection to your Death Intimation of'+' ' + pensioner +' '+'against reference number' +' '+ ref +','+'You are hereby requested to visit Hooghly Treasury - I regarding payment of LTA. If you are Family Pensioner Please Ignore this message';
    }
}


module.exports= {message};