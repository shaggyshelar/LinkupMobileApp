import { Component } from '@angular/core';
import { NavController, NavParams,ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProfiledetailsInfo } from './profile-details-model';
/*
  Generated class for the ProfileDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-profile-details',
  templateUrl: 'profile-details.html'
})
export class ProfileDetailsPage {
  AddressForm : FormGroup;
  VisaForm : FormGroup;
  PassportForm : FormGroup;
  UANForm : FormGroup;
  NomineesForm : FormGroup;
  IDProofForm  : FormGroup;
  ProfileDetails : ProfiledetailsInfo = new ProfiledetailsInfo();
  profileDetails: string;
  showHide:boolean = false;
  showAddressForm:boolean = false;
  showVisaForm :boolean = false;
  showPassportForm : boolean = false;
  showUANForm : boolean = false;
  showNomineesForm : boolean = false;
  showIDProofForm : boolean = false;
  showAadharID : boolean = false;
  showVoterID : boolean = false;
  showDrivingID : boolean = false;
  showChooseFile : boolean = false;
  showIdentityType : boolean = true;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public fb: FormBuilder) {
                this.profileDetails = 'Address';
                this.AddressForm = fb.group({
                  'currentaddress' : [null, Validators.required],
                  'permanentaddress' : [null, Validators.required]
                  })
                this.VisaForm = fb.group({
                  'visanumber' : [null, Validators.required],
                  'visaexpirydate' : [null, Validators.required],
                  'visatype' : [null, Validators.required],
                  'scannedcopy' : [null, Validators.required],
                  })
                this.PassportForm = fb.group({
                  'passportnumber' : [null, Validators.required],
                  'passportexpirydate' : [null, Validators.required],
                  'scannedcopy' : [null, Validators.required],
                  })
                this.UANForm = fb.group({
                  'UANnumber' : [null, Validators.required],
                  'fromespl' : [null]
                  })
                this.NomineesForm = fb.group({
                  'nomineename' : [null, Validators.required],
                  'nomineerelationship' : [null, Validators.required]
                  })
                this.IDProofForm = fb.group({
                  'identitytype' : [null, Validators.required],
                  'voterid': [null, Validators.required],
                  'aadharcard':[null,Validators.required],
                  'drivinglicence':[null,Validators.required]
                  })
               }

  ionViewDidLoad() {
     //TO DO:Implementation
  }
  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }
  selectID(ID:string) { 
    if(ID === 'Aadhar Card'){
      this.showAadharID = true;
      this.showChooseFile = true;
      this.showVoterID = false;
      this.showDrivingID = false;
    }
    if(ID === 'Voter ID'){
      this.showAadharID = false;
      this.showChooseFile = true;
      this.showVoterID = true;
      this.showDrivingID = false;
    }
    if(ID === 'Driving Licence'){
      this.showAadharID = false;
      this.showChooseFile = true;
      this.showVoterID = false;
      this.showDrivingID = true;
    }
  }
  onAddForm(segment:string) {
    if(segment === 'Address'){
      this.showHide = true;
      this.showAddressForm = true;
      this.ProfileDetails.CurrentAddress = '';
      this.ProfileDetails.PermanentAddress = '';
    }
    if(segment === 'Visa'){
      this.showHide = true;
      this.showVisaForm = true;
      this.ProfileDetails.VisaNumber = '';
      this.ProfileDetails.VisaType = '';
    }
    if(segment === 'Passport'){
      this.showHide = true;
      this.showPassportForm = true;
      this.ProfileDetails.PassportNumber = '';
    }
    if(segment === 'UAN'){
      this.showHide = true;
      this.showUANForm = true;
      this.ProfileDetails.UANNumber = '';
    }
    if(segment === 'Nominees'){
      this.showHide = true;
      this.showNomineesForm = true;
      this.ProfileDetails.NomineeName = '';
      this.ProfileDetails.NomineeRelation = '';
    }
    if(segment === 'ID proof'){
      this.showHide = true;
      this.showIDProofForm = true;
      this.showIdentityType = true;
      this.ProfileDetails.DrivingLicence = '';
    }
  }
  onCloseForm(segment:string) {
    if(segment === 'Address'){
      this.showHide = false;
      this.showAddressForm = false;
    }
    if(segment === 'Visa'){
      this.showHide = false;
      this.showVisaForm = false;
    }
    if(segment === 'Passport'){
      this.showHide = false;
      this.showPassportForm = false;
    }
    if(segment === 'UAN'){
      this.showHide = false;
      this.showUANForm = false;
    }
    if(segment === 'Nominees'){
      this.showHide = false;
      this.showNomineesForm = false;
    }
    if(segment === 'ID proof'){
      this.showHide = false;
      this.showIDProofForm = false;
    }
  }
  editAddressList() {
    this.showHide = true;
    this.showAddressForm = true;
    this.ProfileDetails.CurrentAddress = 'Audumber B SNo 15/7 +BA warje jakat naka, karve nagar, Pune - 411052';
    this.ProfileDetails.PermanentAddress = '53, shivparvati colony, karwand naka, Shirpur	Shirpur - 425405';
  }
  editVisaList() {
    this.showHide = true;
    this.showVisaForm = true;
    this.ProfileDetails.VisaNumber = '123HGDFD989KK';
    this.ProfileDetails.VisaType = 'H1';
  }
  editPassportList() {
    this.showHide = true;
    this.showPassportForm = true;
    this.ProfileDetails.PassportNumber = '123HGDFD989KK';
  }
  editUANList() {
    this.showHide = true;
    this.showUANForm = true;
    this.ProfileDetails.UANNumber = '100546693860';
  }
  editNomineesList() {
    this.showHide = true;
    this.showNomineesForm = true;
    this.ProfileDetails.NomineeName = 'Tukaram Henry Shaikh';
    this.ProfileDetails.NomineeRelation = 'father';
  }
  editIDList() {
    this.ProfileDetails.DrivingLicence = 'ASDH7654OI78';
    this.showHide = true;
    this.showIDProofForm = true;
    this.showIdentityType = false;
    this.showDrivingID = true;
    this.showChooseFile = true;
    
  }
}
