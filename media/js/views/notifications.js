/*
 * NOTIFICATIONS VIEW
 * Currently responsible for the desktop notification modal...
 */

'use strict';

+function(window, $, notify) {

    window.LCB = window.LCB || {};

    window.LCB.NotificationsView = Backbone.View.extend({
        el: '#lcb-notifications',
        focus: true,
        count: 0,
        events: {
            'click [name=desktop-notifications]': 'toggleDesktopNotifications',
            'change [name=audio-notifications]': 'toggleAudioNotifications'
        },
        initialize: function() {
            this.render();
        },
        render: function() {
            var $input = this.$('[name=desktop-notifications]');
            $input.find('.disabled').show()
              .siblings().hide();
            if (!notify.isSupported) {
                $input.attr('disabled', true);
                // Welp we're done here
                return;
            }
            if (notify.permissionLevel() === notify.PERMISSION_GRANTED) {
                $input.find('.enabled').show()
                  .siblings().hide();
                this.$('[name=audio-notifications]').parent().css('color', 'black');
                this.$('[name=audio-notifications]').prop('disabled', false);
            }
            if (notify.permissionLevel() === notify.PERMISSION_DENIED) {
                $input.find('.blocked').show()
                  .siblings().hide();
                this.$('[name=audio-notifications]').parent().css('color', 'gray');
                this.$('[name=audio-notifications]').prop('disabled', true);
            }
            var $audioEnabled = this.readCookie('audio-notifications') || false;
            if($audioEnabled === "true"){
                this.$('[name=audio-notifications]').prop('checked', true);
            } else {
                this.$('[name=audio-notifications]').prop('checked', false);
            }
        },
        toggleDesktopNotifications: function() {
            var self = this;
            if (!notify.isSupported) {
                return;
            }
            notify.requestPermission(function() {
                self.render();
            });
        },
        toggleAudioNotifications: function(){
            var $input = this.$('[name=audio-notifications]');
            if($input.is(':checked')){
                this.createCookie('audio-notifications', true, 30);
            } else {
                this.createCookie('audio-notifications', false, 30);
            }
        },
        createCookie: function(name,value,days) {
            if (days) {
                var date = new Date();
                date.setTime(date.getTime()+(days*24*60*60*1000));
                var expires = "; expires="+date.toGMTString();
            }
            else var expires = "";
            document.cookie = name+"="+value+expires+"; path=/";
        },
        readCookie: function(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        }
    });

}(window, $, notify);