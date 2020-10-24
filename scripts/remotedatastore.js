
(function (window) {
    'use strict';
    var App = window.App || {};
    var $ = window.jQuery;
  
    function FirebaseDataStore(config) {
      if (!config) {
        throw new Error('No remote URL supplied.');
      }
      firebase.initializeApp(config);
      this.db = firebase.firestore();
    }

    FirebaseDataStore.prototype.add = function (key, val) {
      return this.db.collection("orders").doc(key).set({
        name: val.coffee,
        emailAddress: key,
        flavor: val.flavor,
        size: val.size,
        strength: val.strength
      })
    };

    FirebaseDataStore.prototype.getAll = function () {
      var dict = {};
      this.db.collection("orders").get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              dict[doc.id] = doc.data();
              console.log(doc.id, " => ", doc.data());
          });
          return dict;
      });
    };
    FirebaseDataStore.prototype.get = function (key, cb) {
      var docRef = this.db.collection("orders").doc(key);
        return docRef.get();
    };

    FirebaseDataStore.prototype.remove = function (key) {
      this.db.collection("orders").doc(key).delete().then(function() {
          console.log("Document successfully deleted!");
      }).catch(function(error) {
          console.error("Error removing document: ", error);
      });
    };

    FirebaseDataStore.prototype.initalizeChecklist = function (checklist) {
      this.db.collection("orders").get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            checklist.addRow.call(checklist, doc.data());
          });
      });
    };
  
    App.FirebaseDataStore = FirebaseDataStore;
    window.App = App;
  
  })(window);