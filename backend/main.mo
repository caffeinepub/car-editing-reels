import Text "mo:core/Text";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Char "mo:core/Char";

actor {
  type Reel = {
    id : Nat;
    title : Text;
    description : Text;
    videoUrl : Text;
    thumbnailUrl : Text;
    tags : [Text];
    uploader : Text;
    viewCount : Nat;
  };

  type NewReel = {
    title : Text;
    description : Text;
    videoUrl : Text;
    thumbnailUrl : Text;
    tags : [Text];
    uploader : Text;
  };

  let reels = Map.empty<Nat, Reel>();
  var nextReelId = 0;

  type ViewRange = {
    start : Nat;
    end : Nat;
  };

  func rangeIter(list : List.List<Reel>, range : ViewRange) : Iter.Iter<Reel> {
    if (range.start >= list.size() or range.end <= range.start) {
      return List.empty<Reel>().values();
    };

    let adjustedEnd = if (range.end > list.size()) {
      list.size();
    } else {
      range.end;
    };

    let takeAmount = adjustedEnd - range.start;
    list.values().drop(range.start).take(takeAmount);
  };

  public shared ({ caller }) func submitReel(newReel : NewReel) : async Nat {
    let reelId = nextReelId;
    nextReelId += 1;

    let reel : Reel = {
      id = reelId;
      title = newReel.title;
      description = newReel.description;
      videoUrl = newReel.videoUrl;
      thumbnailUrl = newReel.thumbnailUrl;
      tags = newReel.tags;
      uploader = newReel.uploader;
      viewCount = 0;
    };

    reels.add(reelId, reel);
    reelId;
  };

  public query ({ caller }) func getReel(id : Nat) : async Reel {
    switch (reels.get(id)) {
      case (null) { Runtime.trap("Reel not found") };
      case (?reel) { reel };
    };
  };

  public shared ({ caller }) func incrementViewCount(id : Nat) : async Bool {
    var reel = switch (reels.get(id)) {
      case (null) { Runtime.trap("Reel not found") };
      case (?reel) { reel };
    };
    let newViewCount = reel.viewCount + 1;
    reel := { reel with viewCount = newViewCount };
    reels.add(id, reel);
    true;
  };

  public query ({ caller }) func getFeaturedReels(range : ViewRange) : async [Reel] {
    rangeIter(reels.values().toList(), range).toArray();
  };

  public query ({ caller }) func getAllReels() : async [Reel] {
    reels.values().toArray();
  };

  func joinTags(tags : [Text], separator : Text) : Text {
    switch (tags.size()) {
      case (0) { "" };
      case (1) { tags[0] };
      case (_) {
        tags.values().foldLeft(tags[0], func(acc, tag) { acc # separator # tag });
      };
    };
  };

  public query ({ caller }) func filterByTag(search : Text, range : ViewRange) : async [Reel] {
    let filtered = reels.values().toList<Reel>().filter(
      func(reel) {
        if (reel.tags.size() == 0) {
          return false;
        };
        let joinedTags = joinTags(reel.tags, " ");
        joinedTags.contains(#text(search));
      }
    );
    rangeIter(filtered, range).toArray();
  };
};
