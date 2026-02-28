import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  type OldActor = {
    footage : Map.Map<Nat, OldFootageMetadata>;
    nextFootageId : Nat;
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  type OldFootageMetadata = {
    id : Nat;
    title : Text;
    description : Text;
    videoUrl : Text;
    thumbnailUrl : Text;
    carType : OldCarType;
    shootingStyle : OldShootingStyle;
    resolution : OldResolution;
    frameRate : OldFrameRate;
    uploader : Text;
    uploadTimestamp : Nat;
    approvalStatus : OldApprovalStatus;
    viewCount : Nat;
  };

  type OldCarType = {
    #sedan;
    #suv;
    #truck;
    #sportsCar;
    #classicCar;
    #convertible;
  };

  type OldShootingStyle = {
    #track;
    #drift;
    #cruise;
    #offroad;
  };

  type OldResolution = {
    #low;
    #medium;
    #high;
    #ultra;
  };

  type OldFrameRate = {
    #fps24;
    #fps30;
    #fps60;
    #fps120;
  };

  type OldApprovalStatus = {
    #pending;
    #approved;
    #rejected;
  };

  type OldUserProfile = {
    name : Text;
    bio : Text; // This field will be removed in the new version
  };

  type StoredImage = {
    id : Text;
    blob : Storage.ExternalBlob;
    timestamp : Int;
    owner : Principal;
  };

  type NewActor = {
    images : Map.Map<Text, StoredImage>;
    nextId : Nat;
    userProfiles : Map.Map<Principal, NewUserProfile>;
  };

  type NewUserProfile = {
    name : Text; // No bio field in the new version
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_id, oldProfile) {
        { name = oldProfile.name };
      }
    );
    {
      images = Map.empty<Text, StoredImage>();
      nextId = 0;
      userProfiles = newUserProfiles;
    };
  };
};
