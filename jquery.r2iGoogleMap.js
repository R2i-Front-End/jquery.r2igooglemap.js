/*
* jQuery Google Map Plugin
* Version 1.0
* Requires jQuery v1.7 or later and A GOOGLE API KEY THAT HAS GOOGLE MAPS JS ENABLED
*
* Copyright (c) 2013 R2integrated
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
* THE MAP LOCATIONS ARRAY
* {
    name: '[NAME OF  LOCATION]',
    description: '[DESCRIPTION OF LOCATION]',
    address1: '[STREET ADDRESS]'
    city: '[CITY]',
    state: '[STATE NAME OR ABBREVIATION]',
    zipCode: [ZIP CODE],
    lat: [LATITUDE OF LOCATION ON MAP],
    lng: [LONGITUDE OF LOCATION ON MAP],
    infoWindowContent: '<div class="content"><h4>[TEXT FOR THE HEADING]</h4><p>[TEXT FOR THE DESCRIPTION]</p><p>[ADDRESS]</p></div>'
  }

  OPTIONAL ITEMS TO ADD TO THE OBJECT
  For a SVG Icon use:
  icon: {
    path: '[NAME OF PATH]',
    fillColor: '#[HEX VALUE]',
    fillOpacity: [FILL OPACITY 0 - 1.0],
    scale: [SCALE OF ICON ON MAP],
    strokeColor: '#[HEX VALUE]',
    strokeWeight: [STROKE WEIGHT IN POINTS],
    anchorX: ([WIDTH OF ICON] / 2), 
    anchorY: ([HEIGHT OF ICON] / 2)
  }
  For an image Icon use:
  icon : 'url of image'
*/

(function (jQuery) {
    jQuery.fn.googleMap = function (options) {
        var defaults = {
            mapLocs: [], // An Array of Location Objects
            zoom: 8, // Zoom level, ignored if multiple locations are defined, then datapoint bounds will be used to fit all locations
            draggable: true, // Set to false to make the map not draggable
            zoomControl: true, // set to false to hide the zoom control
            zoomControlPosition: 'RIGHT_BOTTOM', // SEE Acceptable positions for more information
            streetViewControlVis: true, // set to false to hide the Street View Control
            streetViewControlPosition: 'RIGHT_BOTTOM',// SEE Acceptable positions for more information
            scaleControlVis: true, // set to false to hide the Scale Control
            scaleControlPosition: 'BOTTOM_RIGHT',// SEE Acceptable positions for more information
            mapTypeControlVis: true, // set to false to hide the Map Type Control
            mapTypeControlPosition: 'TOP_LEFT',// SEE Acceptable positions for more information
            defaultMapType: 'ROADMAP', // Acceptable Map Types HYBRID, ROADMAP, TERRAIN, SATELLITE, CUSTOM
            infoWindowWidth: 350, // MAX WIDTH OF THE INFOWINDOW
            apiKey: '', // GOOGLE MAPS API KEY
            customMapStyles: [], // CUSTOM MAP STYLES, go to www.snazzymaps.com for more information
            customMapName: 'Custom' // CUSTOM MAP name
        }

        var settings = jQuery.extend({}, defaults, options),
            $obj = jQuery(this),
            $objID = $obj.attr('id'),
            map,
            defaultMapTypeID,
            mapZoomControlPos,
            mapStreetViewPos,
            mapScaleControlPos,
            mapTypeControlPos,
            markers = [],
            infowindows = [],
            centralCoords = { lat: 38, lng: -97},
            customStyles,
            customStylesID;

        // LOAD GOOGLE MAP
        function loadGoogleMap() {
            if (typeof google === 'undefined') {
                jQuery.getScript('https://maps.googleapis.com/maps/api/js?key=' + settings.apiKey, function () {
                    checkGoogleAPI();
                });
            }
        }
        function checkGoogleAPI() {
            if (typeof google === 'undefined') {
                setTimeout(checkGoogleAPI, 200);
            } else {
                initGoogleMap();
            }
        }
        function setMapStyles() {
            customStyles = new google.maps.StyledMapType(settings.customMapStyles, { name: settings.customMapName });
            settings.mapTypeControlVis = false;
            settings.defaultMapType = 'CUSTOM';
            customStylesID = settings.customMapName;
            customStylesID = customStylesID.split(' ').join('_').toLowerCase();
            return customStyles;
        }
        function setMapType() {
            switch (settings.defaultMapType) {
                case 'CUSTOM':
                    return customStylesID;
                    break;
                case 'ROADMAP':
                    return google.maps.MapTypeId.ROADMAP;
                    break;
                case 'SATELLITE':
                    return google.maps.MapTypeId.SATELLITE;
                    break;
                case 'HYBRID':
                    return google.maps.MapTypeId.HYBRID;
                    break;
                case 'TERRAIN':
                    return google.maps.MapTypeId.TERRAIN;
                    break;
                default:
                    return google.maps.MapTypeId.ROADMAP;
                    break;
            }
        }
        function setControlPosition(controlPos) {
            switch (controlPos) {
                case 'BOTTOM_LEFT':
                    return google.maps.ControlPosition.BOTTOM_LEFT;
                    break;
                case 'BOTTOM_CENTER':
                    return google.maps.ControlPosition.BOTTOM_CENTER;
                    break;
                case 'BOTTOM_RIGHT':
                    return google.maps.ControlPosition.BOTTOM_RIGHT;
                    break;
                case 'LEFT_BOTTOM':
                    return google.maps.ControlPosition.LEFT_BOTTOM;
                    break;
                case 'LEFT_CENTER':
                    return google.maps.ControlPosition.LEFT_CENTER;
                    break;
                case 'LEFT_TOP':
                    return google.maps.ControlPosition.LEFT_TOP;
                    break;
                case 'TOP_LEFT':
                    return google.maps.ControlPosition.TOP_LEFT;
                    break;
                case 'TOP_CENTER':
                    return google.maps.ControlPosition.TOP_CENTER;
                    break;
                case 'TOP_RIGHT':
                    return google.maps.ControlPosition.TOP_RIGHT;
                    break;
                case 'RIGHT_BOTTOM':
                    return google.maps.ControlPosition.RIGHT_BOTTOM;
                    break;
                case 'RIGHT_CENTER':
                    return google.maps.ControlPosition.RIGHT_CENTER;
                    break;
                case 'RIGHT_TOP':
                    return google.maps.ControlPosition.RIGHT_TOP;
                    break;
                default:
                    return '';
                    break;
            }
        }
        // CREATE CENTER POINT
        function createCenterPoint() {
            if (markers.length > 0) {
                var centralX = 0,
                    centralY = 0,
                    centralZ = 0;

                var locTot = settings.mapLocs.length;

                for (var i = 0; i < locTot; i++) {
                    var locLat = settings.mapLocs[i].lat * Math.PI / 180,
                        locLng = settings.mapLocs[i].lng * Math.PI / 180;

                    centralX += Math.cos(locLat) * Math.cos(locLng);
                    centralY += Math.cos(locLat) * Math.sin(locLng);
                    centralZ += Math.sin(locLat);
                }

                centralX = centralX / locTot;
                centralY = centralY / locTot;
                centralZ = centralZ / locTot;

                var centralLng = Math.atan2(centralY, centralX);
                var centralSquareRoot = Math.sqrt(centralX * centralX + centralY * centralY);
                var centralLat = Math.atan2(centralZ, centralSquareRoot);

                centralCoords.lat = centralLat * 180 / Math.PI;
                centralCoords.lng = centralLng * 180 / Math.PI;
            }
            return centralCoords;
        }
        // SET BOUNDS
        function setBounds() {
            if (markers.length > 0) {
                var bounds = new google.maps.LatLngBounds();
                for (var i = 0; i < markers.length; i++) {
                    bounds.extend(markers[i].getPosition());
                }
                map.fitBounds(bounds);
            }
        }
        // CREATE MARKERS
        function createMarkers(i) {
            if (typeof settings.mapLocs[i].icon !== 'undefined' && typeof settings.mapLocs[i].icon.path !== 'undefined') {
                markers[i] = new google.maps.Marker({
                    map: map,
                    position: new google.maps.LatLng(settings.mapLocs[i].lat, settings.mapLocs[i].lng),
                    draggable: false,
                    raiseOnDrag: false,
                    title: settings.mapLocs[i].name,
                    visible: true,
                    icon: {
                        path: settings.mapLocs[i].icon.path,
                        fillColor: settings.mapLocs[i].icon.fillColor,
                        fillOpacity: settings.mapLocs[i].icon.fillOpacity,
                        scale: settings.mapLocs[i].icon.scale,
                        strokeColor: settings.mapLocs[i].icon.strokeColor,
                        strokeWeight: settings.mapLocs[i].icon.strokeWeight,
                        anchor: new google.maps.Point(settings.mapLocs[i].icon.anchorX, settings.mapLocs[i].icon.anchorY)
                    }
                });
            } else if (typeof settings.mapLocs[i].icon !== 'undefined') {
                markers[i] = new google.maps.Marker({
                    map: map,
                    position: new google.maps.LatLng(settings.mapLocs[i].lat, settings.mapLocs[i].lng),
                    draggable: false,
                    raiseOnDrag: false,
                    title: settings.mapLocs[i].name,
                    visible: true,
                    icon: settings.mapLocs[i].icon
                });
            } else {
                markers[i] = new google.maps.Marker({
                    map: map,
                    position: new google.maps.LatLng(settings.mapLocs[i].lat, settings.mapLocs[i].lng),
                    draggable: false,
                    raiseOnDrag: false,
                    title: settings.mapLocs[i].name,
                    visible: true
                });
            }
            infowindows[i] = new google.maps.InfoWindow({
                content: settings.mapLocs[i].infoWindowContent
            });
            markers[i].addListener('click', function () {
                infowindows[i].open(map, markers[i]);
            });
        }
        // INIT GOOGLE MAP
        function initGoogleMap() {
            if (settings.customMapStyles.length > 0) {
                setMapStyles();
            }
            map = new google.maps.Map(document.getElementById($objID), {
                center: createCenterPoint(),
                zoom: 4,
                zoomControl: settings.zoomControlVis,
                zoomControlOptions: {
                    position: setControlPosition(settings.zoomControlPosition)
                },
                streetViewControl: settings.streetViewControlVis,
                streetViewControlOptions: {
                    position: setControlPosition(settings.streetViewControlPosition)
                },
                scaleControl: settings.scaleControlVis,
                scaleControlOptions: {
                    position: setControlPosition(settings.scaleControlPosition)
                },
                mapTypeId: setMapType(),
                mapTypeControl: settings.mapTypeControlVis,
                mapTypeControlOptions: {
                    position: setControlPosition(settings.mapTypeControlPosition)
                }
            });
            for (var i = 0; i < settings.mapLocs.length; i++) {
                createMarkers(i);
            }
            setBounds();
            if (settings.customMapStyles.length > 0) {
                map.mapTypes.set(customStylesID, customStyles);
                map.setMapTypeId(customStylesID);
            }
        }
        // RETURN FUNCTION
        return this.each(function () {
            loadGoogleMap();
        });
    }
}(jQuery));