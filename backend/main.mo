import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Blob "mo:core/Blob";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Time "mo:core/Time";
import Migration "migration";
import Principal "mo:core/Principal";

(with migration = Migration.run)
actor {
  public type Timestamp = Int;

  public type ImageId = Text;

  public type StoredImage = {
    id : ImageId;
    blob : Storage.ExternalBlob;
    timestamp : Timestamp;
    owner : Principal;
  };

  let images = Map.empty<ImageId, StoredImage>();
  var nextId = 0;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func uploadImage(blob : Storage.ExternalBlob) : async ImageId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload images");
    };
    let id = nextId.toText();
    nextId += 1;
    let storedImage = {
      id;
      blob;
      timestamp = Time.now();
      owner = caller;
    };
    images.add(id, storedImage);
    id;
  };

  public query ({ caller = _ }) func getImage(id : ImageId) : async ?StoredImage {
    images.get(id);
  };

  public shared ({ caller }) func deleteImage(id : ImageId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete images");
    };
    switch (images.get(id)) {
      case null {
        Runtime.trap("Image not found");
      };
      case (?image) {
        if (image.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the owner or an admin can delete this image");
        };
        images.remove(id);
      };
    };
  };

  public query ({ caller = _ }) func getAllImages() : async [StoredImage] {
    images.values().toArray();
  };
};
