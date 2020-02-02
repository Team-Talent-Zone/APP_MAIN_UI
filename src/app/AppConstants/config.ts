import { HttpHeaders } from '@angular/common/http';

export const config = {
  dev_ui_url: "http://localhost:4200/",
  httpHeaders : { headers: new HttpHeaders({Authorization: 'Basic cmVzdHNlcnZpY2ViYXNpY2F1dGh1c2VyOlRMIzIwMTdAUkVTVCo4MzI0NjMkIw=='})},
  key_domain: 'domain',
  shortkey_role_cba: 'cba',
  shortkey_role_fu: 'fu',
  shortkey_role_csst: 'csst',
  shortkey_role_cssm: 'cssm',
  shortkey_email_verificationemailaddress: 'eventgen28',
  email_default_fromuser: 'team.spprt2019@gmail.com',
  email_verficationemailaddress_subj: 'Email Confirmation'
};


