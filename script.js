(function(){
    var script = {
 "start": "this.init()",
 "layout": "absolute",
 "data": {
  "name": "Player460"
 },
 "scrollBarWidth": 10,
 "propagateClick": false,
 "id": "rootPlayer",
 "vrPolyfillScale": 0.5,
 "mobileMipmappingEnabled": false,
 "scrollBarVisible": "rollOver",
 "scrollBarColor": "#000000",
 "scrollBarOpacity": 0.5,
 "children": [
  "this.MainViewer"
 ],
 "shadow": false,
 "width": "100%",
 "borderSize": 0,
 "defaultVRPointer": "laser",
 "backgroundPreloadEnabled": true,
 "contentOpaque": false,
 "downloadEnabled": false,
 "paddingLeft": 0,
 "paddingRight": 0,
 "horizontalAlign": "left",
 "scripts": {
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "unregisterKey": function(key){  delete window[key]; },
  "registerKey": function(key, value){  window[key] = value; },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "existsKey": function(key){  return key in window; },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "getKey": function(key){  return window[key]; },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); }
 },
 "height": "100%",
 "scrollBarMargin": 2,
 "minHeight": 20,
 "paddingBottom": 0,
 "class": "Player",
 "borderRadius": 0,
 "gap": 10,
 "desktopMipmappingEnabled": false,
 "overflow": "visible",
 "mouseWheelEnabled": true,
 "paddingTop": 0,
 "minWidth": 20,
 "verticalAlign": "top",
 "definitions": [{
 "vfov": 180,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D63D235_7E13_8FF6_41B9_B7F8A6C7F072_0/f/0/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D63D235_7E13_8FF6_41B9_B7F8A6C7F072_0/u/0/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D63D235_7E13_8FF6_41B9_B7F8A6C7F072_0/r/0/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6D63D235_7E13_8FF6_41B9_B7F8A6C7F072_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D63D235_7E13_8FF6_41B9_B7F8A6C7F072_0/b/0/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D63D235_7E13_8FF6_41B9_B7F8A6C7F072_0/d/0/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D63D235_7E13_8FF6_41B9_B7F8A6C7F072_0/l/0/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_6D63D235_7E13_8FF6_41B9_B7F8A6C7F072",
 "label": "5",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_6D63D235_7E13_8FF6_41B9_B7F8A6C7F072_t.jpg",
 "partial": false,
 "class": "Panorama",
 "overlays": [
  "this.overlay_654E8399_7E6F_8CBE_41B2_C7244D1B081D"
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": 158.03,
   "class": "AdjacentPanorama",
   "backwardYaw": 152.74,
   "panorama": "this.panorama_6D71EDE6_7E13_9495_41D1_6DC79DDF43CA"
  }
 ]
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": -12.05,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_6DF9520A_7ED8_D60C_41C9_8E493233AADF",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "items": [
  {
   "media": "this.panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9",
   "camera": "this.panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_6C20B486_7E13_7492_41B0_CDD3048245FF",
   "camera": "this.panorama_6C20B486_7E13_7492_41B0_CDD3048245FF_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC",
   "camera": "this.panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_6D71D738_7E13_95FE_41D4_EF0BFC47C54F",
   "camera": "this.panorama_6D71D738_7E13_95FE_41D4_EF0BFC47C54F_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_6D71EDE6_7E13_9495_41D1_6DC79DDF43CA",
   "camera": "this.panorama_6D71EDE6_7E13_9495_41D1_6DC79DDF43CA_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_6D63D235_7E13_8FF6_41B9_B7F8A6C7F072",
   "camera": "this.panorama_6D63D235_7E13_8FF6_41B9_B7F8A6C7F072_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 6)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_6D6176AC_7E13_B496_41D7_FCC6C4EE6DA4",
   "camera": "this.panorama_6D6176AC_7E13_B496_41D7_FCC6C4EE6DA4_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 6, 7)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_6D60047E_7E13_9472_41A7_3C10D18ECE17",
   "camera": "this.panorama_6D60047E_7E13_9472_41A7_3C10D18ECE17_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 7, 8)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_6D7D394E_7E13_9D95_41D0_72A8F3EDC322",
   "camera": "this.panorama_6D7D394E_7E13_9D95_41D0_72A8F3EDC322_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 8, 9)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_6D671D92_7E13_94B2_41D1_1730F48F588E",
   "camera": "this.panorama_6D671D92_7E13_94B2_41D1_1730F48F588E_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 9, 10)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_6D61F230_7E13_8F8D_41B2_7EA071556384",
   "camera": "this.panorama_6D61F230_7E13_8F8D_41B2_7EA071556384_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 10, 11)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_70829F19_7E6B_2E0C_41CB_416A3F86CAC0",
   "camera": "this.panorama_70829F19_7E6B_2E0C_41CB_416A3F86CAC0_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 11, 12)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_7011F3C4_7E6B_5604_41C5_69B87471F82C",
   "camera": "this.panorama_7011F3C4_7E6B_5604_41C5_69B87471F82C_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 12, 13)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_7016A819_7E6B_520C_41C7_14EE9A141AAE",
   "camera": "this.panorama_7016A819_7E6B_520C_41C7_14EE9A141AAE_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 13, 14)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_70113C6A_7E6B_520C_41D0_D66386913170",
   "camera": "this.panorama_70113C6A_7E6B_520C_41D0_D66386913170_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 14, 15)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_6F35E656_7E78_DE04_41D0_25066611AE2E",
   "end": "this.trigger('tourEnded')",
   "camera": "this.panorama_6F35E656_7E78_DE04_41D0_25066611AE2E_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 15, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem"
  }
 ],
 "id": "mainPlayList",
 "class": "PlayList"
},
{
 "vfov": 180,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6C20B486_7E13_7492_41B0_CDD3048245FF_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6C20B486_7E13_7492_41B0_CDD3048245FF_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6C20B486_7E13_7492_41B0_CDD3048245FF_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6C20B486_7E13_7492_41B0_CDD3048245FF_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6C20B486_7E13_7492_41B0_CDD3048245FF_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6C20B486_7E13_7492_41B0_CDD3048245FF_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6C20B486_7E13_7492_41B0_CDD3048245FF_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6C20B486_7E13_7492_41B0_CDD3048245FF_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6C20B486_7E13_7492_41B0_CDD3048245FF_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6C20B486_7E13_7492_41B0_CDD3048245FF_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6C20B486_7E13_7492_41B0_CDD3048245FF_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6C20B486_7E13_7492_41B0_CDD3048245FF_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6C20B486_7E13_7492_41B0_CDD3048245FF_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6C20B486_7E13_7492_41B0_CDD3048245FF_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6C20B486_7E13_7492_41B0_CDD3048245FF_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6C20B486_7E13_7492_41B0_CDD3048245FF_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6C20B486_7E13_7492_41B0_CDD3048245FF_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6C20B486_7E13_7492_41B0_CDD3048245FF_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6C20B486_7E13_7492_41B0_CDD3048245FF_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_6C20B486_7E13_7492_41B0_CDD3048245FF",
 "label": "1 (1)",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_6C20B486_7E13_7492_41B0_CDD3048245FF_t.jpg",
 "partial": false,
 "class": "Panorama",
 "overlays": [
  "this.overlay_679DD4CF_7E6D_B492_41C4_3CA6DF24FF7D",
  "this.overlay_6477CFA5_7E12_B496_41A0_EF6D02C06FF0"
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": -151.89,
   "class": "AdjacentPanorama",
   "backwardYaw": 110.02,
   "panorama": "this.panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC"
  },
  {
   "distance": 1,
   "yaw": 6.52,
   "class": "AdjacentPanorama",
   "backwardYaw": 0.78,
   "panorama": "this.panorama_6D60047E_7E13_9472_41A7_3C10D18ECE17"
  }
 ]
},
{
 "viewerArea": "this.MainViewer",
 "touchControlMode": "drag_rotation",
 "displayPlaybackBar": true,
 "mouseControlMode": "drag_acceleration",
 "id": "MainViewerPanoramaPlayer",
 "class": "PanoramaPlayer",
 "gyroscopeVerticalDraggingEnabled": true
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": -89.24,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_6D9441A8_7ED8_D20C_41C3_E7F632E374D3",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": -179.22,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_6A4950FA_7ED8_D20C_41D4_052B6B25A5B7",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": 116.18,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_6DAD71D3_7ED8_D21C_4199_B208A9B29EEA",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "vfov": 180,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D7D394E_7E13_9D95_41D0_72A8F3EDC322_0/f/0/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D7D394E_7E13_9D95_41D0_72A8F3EDC322_0/u/0/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D7D394E_7E13_9D95_41D0_72A8F3EDC322_0/r/0/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6D7D394E_7E13_9D95_41D0_72A8F3EDC322_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D7D394E_7E13_9D95_41D0_72A8F3EDC322_0/b/0/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D7D394E_7E13_9D95_41D0_72A8F3EDC322_0/d/0/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D7D394E_7E13_9D95_41D0_72A8F3EDC322_0/l/0/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_6D7D394E_7E13_9D95_41D0_72A8F3EDC322",
 "label": "10",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_6D7D394E_7E13_9D95_41D0_72A8F3EDC322_t.jpg",
 "partial": false,
 "class": "Panorama",
 "overlays": [
  "this.overlay_68D99A25_7E7E_BF97_41CD_29D0FEAFEF1D",
  "this.overlay_665B5B9D_7E13_BCB7_41B2_9871047EC47B"
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": 113.98,
   "class": "AdjacentPanorama",
   "backwardYaw": 90.76,
   "panorama": "this.panorama_6D61F230_7E13_8F8D_41B2_7EA071556384"
  },
  {
   "distance": 1,
   "yaw": -100.17,
   "class": "AdjacentPanorama",
   "backwardYaw": 169.4,
   "panorama": "this.panorama_70829F19_7E6B_2E0C_41CB_416A3F86CAC0"
  }
 ]
},
{
 "vfov": 180,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D671D92_7E13_94B2_41D1_1730F48F588E_0/f/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D671D92_7E13_94B2_41D1_1730F48F588E_0/f/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D671D92_7E13_94B2_41D1_1730F48F588E_0/u/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D671D92_7E13_94B2_41D1_1730F48F588E_0/u/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D671D92_7E13_94B2_41D1_1730F48F588E_0/r/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D671D92_7E13_94B2_41D1_1730F48F588E_0/r/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6D671D92_7E13_94B2_41D1_1730F48F588E_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D671D92_7E13_94B2_41D1_1730F48F588E_0/b/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D671D92_7E13_94B2_41D1_1730F48F588E_0/b/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D671D92_7E13_94B2_41D1_1730F48F588E_0/d/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D671D92_7E13_94B2_41D1_1730F48F588E_0/d/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D671D92_7E13_94B2_41D1_1730F48F588E_0/l/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D671D92_7E13_94B2_41D1_1730F48F588E_0/l/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_6D671D92_7E13_94B2_41D1_1730F48F588E",
 "label": "11",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_6D671D92_7E13_94B2_41D1_1730F48F588E_t.jpg",
 "partial": false,
 "class": "Panorama",
 "overlays": [
  "this.overlay_68D307E8_7E72_F49D_41BF_AA2B4653244D",
  "this.overlay_64E2DF88_7E15_B49E_41D3_2DB1EA8E8F9B"
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": 104.04,
   "class": "AdjacentPanorama",
   "backwardYaw": 34.21,
   "panorama": "this.panorama_6D61F230_7E13_8F8D_41B2_7EA071556384"
  },
  {
   "distance": 1,
   "yaw": 1.67,
   "class": "AdjacentPanorama",
   "backwardYaw": -139.1,
   "panorama": "this.panorama_6D60047E_7E13_9472_41A7_3C10D18ECE17"
  }
 ]
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": 79.83,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_6C41C16F_7ED8_D204_41CC_7A3B3B92637D",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "vfov": 180,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC",
 "label": "2",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC_t.jpg",
 "partial": false,
 "class": "Panorama",
 "overlays": [
  "this.overlay_6A383BE3_7E77_BC92_41DF_2237D2C51D3A",
  "this.overlay_65A46DCE_7E75_B492_41DC_653C4A19E051",
  "this.overlay_65E0E6A6_7E72_9492_41C8_C2AD9718DF38"
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": 110.02,
   "class": "AdjacentPanorama",
   "backwardYaw": -151.89,
   "panorama": "this.panorama_6C20B486_7E13_7492_41B0_CDD3048245FF"
  },
  {
   "distance": 1,
   "yaw": -81.61,
   "class": "AdjacentPanorama",
   "backwardYaw": 1.58,
   "panorama": "this.panorama_6D71D738_7E13_95FE_41D4_EF0BFC47C54F"
  },
  {
   "distance": 1,
   "yaw": 0.84,
   "class": "AdjacentPanorama",
   "backwardYaw": -5.79,
   "panorama": "this.panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9"
  }
 ]
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": 98.39,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_6D80F1BD_7ED8_D204_41CC_017BE693FD81",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_6D63D235_7E13_8FF6_41B9_B7F8A6C7F072_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "vfov": 180,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D6176AC_7E13_B496_41D7_FCC6C4EE6DA4_0/f/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D6176AC_7E13_B496_41D7_FCC6C4EE6DA4_0/f/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D6176AC_7E13_B496_41D7_FCC6C4EE6DA4_0/u/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D6176AC_7E13_B496_41D7_FCC6C4EE6DA4_0/u/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D6176AC_7E13_B496_41D7_FCC6C4EE6DA4_0/r/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D6176AC_7E13_B496_41D7_FCC6C4EE6DA4_0/r/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6D6176AC_7E13_B496_41D7_FCC6C4EE6DA4_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D6176AC_7E13_B496_41D7_FCC6C4EE6DA4_0/b/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D6176AC_7E13_B496_41D7_FCC6C4EE6DA4_0/b/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D6176AC_7E13_B496_41D7_FCC6C4EE6DA4_0/d/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D6176AC_7E13_B496_41D7_FCC6C4EE6DA4_0/d/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D6176AC_7E13_B496_41D7_FCC6C4EE6DA4_0/l/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D6176AC_7E13_B496_41D7_FCC6C4EE6DA4_0/l/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_6D6176AC_7E13_B496_41D7_FCC6C4EE6DA4",
 "label": "6",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_6D6176AC_7E13_B496_41D7_FCC6C4EE6DA4_t.jpg",
 "partial": false,
 "class": "Panorama",
 "overlays": [
  "this.overlay_65E4CE67_7E6D_9793_41D1_67D18A796EB7"
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6D63D235_7E13_8FF6_41B9_B7F8A6C7F072"
  }
 ]
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": -178.33,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_6C683190_7ED8_D21C_41D5_8AEFC2CBBBB6",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 174.21,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_6DC2B1FF_7ED8_D204_41D5_D775D6E62F15",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_6D71D738_7E13_95FE_41D4_EF0BFC47C54F_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "vfov": 180,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D71D738_7E13_95FE_41D4_EF0BFC47C54F_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6D71D738_7E13_95FE_41D4_EF0BFC47C54F_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D71D738_7E13_95FE_41D4_EF0BFC47C54F_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D71D738_7E13_95FE_41D4_EF0BFC47C54F_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6D71D738_7E13_95FE_41D4_EF0BFC47C54F_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D71D738_7E13_95FE_41D4_EF0BFC47C54F_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D71D738_7E13_95FE_41D4_EF0BFC47C54F_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6D71D738_7E13_95FE_41D4_EF0BFC47C54F_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D71D738_7E13_95FE_41D4_EF0BFC47C54F_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6D71D738_7E13_95FE_41D4_EF0BFC47C54F_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D71D738_7E13_95FE_41D4_EF0BFC47C54F_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6D71D738_7E13_95FE_41D4_EF0BFC47C54F_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D71D738_7E13_95FE_41D4_EF0BFC47C54F_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D71D738_7E13_95FE_41D4_EF0BFC47C54F_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6D71D738_7E13_95FE_41D4_EF0BFC47C54F_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D71D738_7E13_95FE_41D4_EF0BFC47C54F_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D71D738_7E13_95FE_41D4_EF0BFC47C54F_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6D71D738_7E13_95FE_41D4_EF0BFC47C54F_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D71D738_7E13_95FE_41D4_EF0BFC47C54F_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_6D71D738_7E13_95FE_41D4_EF0BFC47C54F",
 "label": "3",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_6D71D738_7E13_95FE_41D4_EF0BFC47C54F_t.jpg",
 "partial": false,
 "class": "Panorama",
 "overlays": [
  "this.overlay_6A35367D_7E75_B476_41DD_3E28FEA56724",
  "this.overlay_6AB53E21_7E75_B791_41DD_66EEAAAC7780"
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": 1.58,
   "class": "AdjacentPanorama",
   "backwardYaw": -81.61,
   "panorama": "this.panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC"
  },
  {
   "distance": 1,
   "yaw": -63.82,
   "class": "AdjacentPanorama",
   "backwardYaw": -11.77,
   "panorama": "this.panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9"
  }
 ]
},
{
 "vfov": 180,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7011F3C4_7E6B_5604_41C5_69B87471F82C_0/f/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_7011F3C4_7E6B_5604_41C5_69B87471F82C_0/f/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7011F3C4_7E6B_5604_41C5_69B87471F82C_0/u/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_7011F3C4_7E6B_5604_41C5_69B87471F82C_0/u/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7011F3C4_7E6B_5604_41C5_69B87471F82C_0/r/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_7011F3C4_7E6B_5604_41C5_69B87471F82C_0/r/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7011F3C4_7E6B_5604_41C5_69B87471F82C_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7011F3C4_7E6B_5604_41C5_69B87471F82C_0/b/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_7011F3C4_7E6B_5604_41C5_69B87471F82C_0/b/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7011F3C4_7E6B_5604_41C5_69B87471F82C_0/d/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_7011F3C4_7E6B_5604_41C5_69B87471F82C_0/d/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7011F3C4_7E6B_5604_41C5_69B87471F82C_0/l/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_7011F3C4_7E6B_5604_41C5_69B87471F82C_0/l/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_7011F3C4_7E6B_5604_41C5_69B87471F82C",
 "label": "336a30c1-3927-4458-a67b-94a084b57ff1",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7011F3C4_7E6B_5604_41C5_69B87471F82C_t.jpg",
 "partial": false,
 "class": "Panorama",
 "overlays": [
  "this.overlay_71E357DE_7E69_DE04_41D5_1A827FCFEC28",
  "this.overlay_6F419648_7E69_DE0C_41DF_0CD4C050382A"
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": 1.53,
   "class": "AdjacentPanorama",
   "backwardYaw": -97.67,
   "panorama": "this.panorama_70113C6A_7E6B_520C_41D0_D66386913170"
  },
  {
   "distance": 1,
   "yaw": 167.95,
   "class": "AdjacentPanorama",
   "backwardYaw": -145.14,
   "panorama": "this.panorama_7016A819_7E6B_520C_41C7_14EE9A141AAE"
  }
 ]
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": -21.97,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_6D16422E_7ED8_D605_41D4_9DE2B749D1F9",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "vfov": 180,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7016A819_7E6B_520C_41C7_14EE9A141AAE_0/f/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_7016A819_7E6B_520C_41C7_14EE9A141AAE_0/f/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7016A819_7E6B_520C_41C7_14EE9A141AAE_0/u/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_7016A819_7E6B_520C_41C7_14EE9A141AAE_0/u/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7016A819_7E6B_520C_41C7_14EE9A141AAE_0/r/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_7016A819_7E6B_520C_41C7_14EE9A141AAE_0/r/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7016A819_7E6B_520C_41C7_14EE9A141AAE_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7016A819_7E6B_520C_41C7_14EE9A141AAE_0/b/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_7016A819_7E6B_520C_41C7_14EE9A141AAE_0/b/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7016A819_7E6B_520C_41C7_14EE9A141AAE_0/d/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_7016A819_7E6B_520C_41C7_14EE9A141AAE_0/d/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7016A819_7E6B_520C_41C7_14EE9A141AAE_0/l/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_7016A819_7E6B_520C_41C7_14EE9A141AAE_0/l/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_7016A819_7E6B_520C_41C7_14EE9A141AAE",
 "label": "92827a2e-4603-4838-bf2e-4c231dae64b6",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7016A819_7E6B_520C_41C7_14EE9A141AAE_t.jpg",
 "partial": false,
 "class": "Panorama",
 "overlays": [
  "this.overlay_6F550E09_7E78_EE0C_41D1_6DC592C66F64"
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": -145.14,
   "class": "AdjacentPanorama",
   "backwardYaw": 167.95,
   "panorama": "this.panorama_7011F3C4_7E6B_5604_41C5_69B87471F82C"
  }
 ]
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_7011F3C4_7E6B_5604_41C5_69B87471F82C_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": -69.98,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_6A5290EC_7ED8_D205_41DB_681209081C9A",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "vfov": 180,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D61F230_7E13_8F8D_41B2_7EA071556384_0/f/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D61F230_7E13_8F8D_41B2_7EA071556384_0/f/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D61F230_7E13_8F8D_41B2_7EA071556384_0/u/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D61F230_7E13_8F8D_41B2_7EA071556384_0/u/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D61F230_7E13_8F8D_41B2_7EA071556384_0/r/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D61F230_7E13_8F8D_41B2_7EA071556384_0/r/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6D61F230_7E13_8F8D_41B2_7EA071556384_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D61F230_7E13_8F8D_41B2_7EA071556384_0/b/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D61F230_7E13_8F8D_41B2_7EA071556384_0/b/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D61F230_7E13_8F8D_41B2_7EA071556384_0/d/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D61F230_7E13_8F8D_41B2_7EA071556384_0/d/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D61F230_7E13_8F8D_41B2_7EA071556384_0/l/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D61F230_7E13_8F8D_41B2_7EA071556384_0/l/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_6D61F230_7E13_8F8D_41B2_7EA071556384",
 "label": "12",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_6D61F230_7E13_8F8D_41B2_7EA071556384_t.jpg",
 "partial": false,
 "class": "Panorama",
 "overlays": [
  "this.overlay_683B9102_7E7D_8D92_41D4_2B9224C808E0",
  "this.overlay_6440AD6D_7E15_9596_41D2_1E5EFC663136"
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": 34.21,
   "class": "AdjacentPanorama",
   "backwardYaw": 104.04,
   "panorama": "this.panorama_6D671D92_7E13_94B2_41D1_1730F48F588E"
  },
  {
   "distance": 1,
   "yaw": 90.76,
   "class": "AdjacentPanorama",
   "backwardYaw": 113.98,
   "panorama": "this.panorama_6D7D394E_7E13_9D95_41D0_72A8F3EDC322"
  }
 ]
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_7016A819_7E6B_520C_41C7_14EE9A141AAE_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_6F35E656_7E78_DE04_41D0_25066611AE2E_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": -178.47,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_6C47B164_7ED8_D204_41C4_72633E90E6AF",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "vfov": 180,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D71EDE6_7E13_9495_41D1_6DC79DDF43CA_0/f/0/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D71EDE6_7E13_9495_41D1_6DC79DDF43CA_0/u/0/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D71EDE6_7E13_9495_41D1_6DC79DDF43CA_0/r/0/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6D71EDE6_7E13_9495_41D1_6DC79DDF43CA_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D71EDE6_7E13_9495_41D1_6DC79DDF43CA_0/b/0/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D71EDE6_7E13_9495_41D1_6DC79DDF43CA_0/d/0/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D71EDE6_7E13_9495_41D1_6DC79DDF43CA_0/l/0/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_6D71EDE6_7E13_9495_41D1_6DC79DDF43CA",
 "label": "4",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_6D71EDE6_7E13_9495_41D1_6DC79DDF43CA_t.jpg",
 "partial": false,
 "class": "Panorama",
 "overlays": [
  "this.overlay_65A785EB_7E73_9493_41B6_355FC2A9FF49",
  "this.overlay_717845A2_7E58_F23C_41D3_2C58FAF96F19"
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": 152.74,
   "class": "AdjacentPanorama",
   "backwardYaw": 158.03,
   "panorama": "this.panorama_6D63D235_7E13_8FF6_41B9_B7F8A6C7F072"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9"
  }
 ]
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_70829F19_7E6B_2E0C_41CB_416A3F86CAC0_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "vfov": 180,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6F35E656_7E78_DE04_41D0_25066611AE2E_0/f/0/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6F35E656_7E78_DE04_41D0_25066611AE2E_0/u/0/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6F35E656_7E78_DE04_41D0_25066611AE2E_0/r/0/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6F35E656_7E78_DE04_41D0_25066611AE2E_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6F35E656_7E78_DE04_41D0_25066611AE2E_0/b/0/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6F35E656_7E78_DE04_41D0_25066611AE2E_0/d/0/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6F35E656_7E78_DE04_41D0_25066611AE2E_0/l/0/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_6F35E656_7E78_DE04_41D0_25066611AE2E",
 "label": "8",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_6F35E656_7E78_DE04_41D0_25066611AE2E_t.jpg",
 "partial": false,
 "class": "Panorama",
 "overlays": [
  "this.overlay_6CDCA4B8_7E77_D20D_419B_89509C36BC9D"
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6D71EDE6_7E13_9495_41D1_6DC79DDF43CA"
  }
 ]
},
{
 "vfov": 180,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_70829F19_7E6B_2E0C_41CB_416A3F86CAC0_0/f/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_70829F19_7E6B_2E0C_41CB_416A3F86CAC0_0/f/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_70829F19_7E6B_2E0C_41CB_416A3F86CAC0_0/u/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_70829F19_7E6B_2E0C_41CB_416A3F86CAC0_0/u/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_70829F19_7E6B_2E0C_41CB_416A3F86CAC0_0/r/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_70829F19_7E6B_2E0C_41CB_416A3F86CAC0_0/r/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_70829F19_7E6B_2E0C_41CB_416A3F86CAC0_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_70829F19_7E6B_2E0C_41CB_416A3F86CAC0_0/b/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_70829F19_7E6B_2E0C_41CB_416A3F86CAC0_0/b/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_70829F19_7E6B_2E0C_41CB_416A3F86CAC0_0/d/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_70829F19_7E6B_2E0C_41CB_416A3F86CAC0_0/d/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_70829F19_7E6B_2E0C_41CB_416A3F86CAC0_0/l/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_70829F19_7E6B_2E0C_41CB_416A3F86CAC0_0/l/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_70829F19_7E6B_2E0C_41CB_416A3F86CAC0",
 "label": "39a567bc-1576-4510-9f12-5411cb2e23fb",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_70829F19_7E6B_2E0C_41CB_416A3F86CAC0_t.jpg",
 "partial": false,
 "class": "Panorama",
 "overlays": [
  "this.overlay_6FF4EF83_7E7F_EEFC_41BD_AC154DAB2E11"
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": 169.4,
   "class": "AdjacentPanorama",
   "backwardYaw": -100.17,
   "panorama": "this.panorama_6D7D394E_7E13_9D95_41D0_72A8F3EDC322"
  }
 ]
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": 34.86,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_6C738186_7ED8_D204_41DE_351E6E3EECAA",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_70113C6A_7E6B_520C_41D0_D66386913170_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": -173.48,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_6C61419C_7ED8_D204_41BA_CF3BBC7891DE",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": 28.11,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_6DD631E9_7ED8_D20C_4196_EEDFBBDC5C78",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": -145.79,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_6DEFA215_7ED8_D604_41D5_57CF799E3A79",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_6D71EDE6_7E13_9495_41D1_6DC79DDF43CA_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_6D60047E_7E13_9472_41A7_3C10D18ECE17_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": -178.42,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_6DCCD1F3_7ED8_D21C_41DF_6E247C44BE8D",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": -75.96,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_6C53E13C_7ED8_D204_41C4_2C68FF2402AD",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "vfov": 180,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_70113C6A_7E6B_520C_41D0_D66386913170_0/f/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_70113C6A_7E6B_520C_41D0_D66386913170_0/f/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_70113C6A_7E6B_520C_41D0_D66386913170_0/u/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_70113C6A_7E6B_520C_41D0_D66386913170_0/u/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_70113C6A_7E6B_520C_41D0_D66386913170_0/r/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_70113C6A_7E6B_520C_41D0_D66386913170_0/r/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_70113C6A_7E6B_520C_41D0_D66386913170_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_70113C6A_7E6B_520C_41D0_D66386913170_0/b/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_70113C6A_7E6B_520C_41D0_D66386913170_0/b/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_70113C6A_7E6B_520C_41D0_D66386913170_0/d/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_70113C6A_7E6B_520C_41D0_D66386913170_0/d/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_70113C6A_7E6B_520C_41D0_D66386913170_0/l/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_70113C6A_7E6B_520C_41D0_D66386913170_0/l/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_70113C6A_7E6B_520C_41D0_D66386913170",
 "label": "b837bf9f-1ef5-4243-a165-d2a029894c34",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_70113C6A_7E6B_520C_41D0_D66386913170_t.jpg",
 "partial": false,
 "class": "Panorama",
 "overlays": [
  "this.overlay_6F4D8991_7E79_521C_41A5_0C98E3655933",
  "this.overlay_6F20F9FC_7E7B_3204_41D7_C13598C9C15D"
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": -97.67,
   "class": "AdjacentPanorama",
   "backwardYaw": 1.53,
   "panorama": "this.panorama_7011F3C4_7E6B_5604_41C5_69B87471F82C"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_70829F19_7E6B_2E0C_41CB_416A3F86CAC0"
  }
 ]
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_6D61F230_7E13_8F8D_41B2_7EA071556384_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": -66.02,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_6C4EA148_7ED8_D20C_41B1_CFF3F56EEAB1",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": 40.9,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_6DE24221_7ED8_D63C_41B1_9D5E37C54083",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": -10.6,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_6D8DC1B2_7ED8_D21C_41D1_E2E4E4CF7AA6",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": 82.33,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_6C7BE17A_7ED8_D20D_41D3_48A5AF066068",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_6D6176AC_7E13_B496_41D7_FCC6C4EE6DA4_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "duration": 5000,
 "label": "Gemini_Generated_Image_ck8zz2ck8zz2ck8z",
 "id": "photo_776E5830_7A76_9B8E_41BF_3B87EBBC1C7B",
 "width": 1098,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/photo_776E5830_7A76_9B8E_41BF_3B87EBBC1C7B.png"
   }
  ]
 },
 "thumbnailUrl": "media/photo_776E5830_7A76_9B8E_41BF_3B87EBBC1C7B_t.png",
 "class": "Photo",
 "height": 456
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": -27.26,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_6C4B3156_7ED8_D205_41C8_51B3C6D86313",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "vfov": 12.45,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9_0/f/0/{row}_{column}.jpg",
      "rowCount": 12,
      "tags": "ondemand",
      "colCount": 12,
      "width": 6144,
      "class": "TiledImageResourceLevel",
      "height": 6144
     },
     {
      "url": "media/panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9_0/f/1/{row}_{column}.jpg",
      "rowCount": 6,
      "tags": "ondemand",
      "colCount": 6,
      "width": 3072,
      "class": "TiledImageResourceLevel",
      "height": 3072
     },
     {
      "url": "media/panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9_0/f/2/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9_0/f/3/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9_0/f/4/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9_t.jpg"
  }
 ],
 "id": "panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9",
 "label": "Gemini_Generated_Image_6dcqf46dcqf46dcq",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9_t.jpg",
 "partial": true,
 "class": "Panorama",
 "overlays": [
  "this.overlay_6A50E742_7A36_B592_41B3_A3326BBBC8CA",
  "this.overlay_6A9E4BCD_7A15_7C96_41D1_33CEDF2F5EB0",
  "this.overlay_6DACD295_7FFD_8CB7_41D8_17905E13B8DF",
  "this.overlay_6DACC900_7FFE_9D8E_4182_EA11A440E210",
  "this.overlay_6D9AB4CC_7FFE_9496_41C3_7D7302B763F6",
  "this.overlay_6D7A3EFD_7FFD_F476_41D6_867A0AD516AF",
  "this.overlay_6D96BDC8_7FF2_949E_41D6_F74EFAC7A9A9",
  "this.overlay_6D27AD20_7FF2_958E_419F_42921CB27BC7",
  "this.overlay_6F22FA6A_7E6E_FF92_41C4_F823980FFA71"
 ],
 "hfovMin": "150%",
 "hfov": 30,
 "hfovMax": 30,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6C20B486_7E13_7492_41B0_CDD3048245FF"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6D7D394E_7E13_9D95_41D0_72A8F3EDC322"
  },
  {
   "distance": 1,
   "yaw": -11.77,
   "class": "AdjacentPanorama",
   "backwardYaw": -63.82,
   "panorama": "this.panorama_6D71D738_7E13_95FE_41D4_EF0BFC47C54F"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6D63D235_7E13_8FF6_41B9_B7F8A6C7F072"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6F35E656_7E78_DE04_41D0_25066611AE2E"
  },
  {
   "distance": 1,
   "yaw": -5.79,
   "class": "AdjacentPanorama",
   "backwardYaw": 0.84,
   "panorama": "this.panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6D60047E_7E13_9472_41A7_3C10D18ECE17"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_7016A819_7E6B_520C_41C7_14EE9A141AAE"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6D6176AC_7E13_B496_41D7_FCC6C4EE6DA4"
  }
 ]
},
{
 "vfov": 180,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D60047E_7E13_9472_41A7_3C10D18ECE17_0/f/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D60047E_7E13_9472_41A7_3C10D18ECE17_0/f/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D60047E_7E13_9472_41A7_3C10D18ECE17_0/u/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D60047E_7E13_9472_41A7_3C10D18ECE17_0/u/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D60047E_7E13_9472_41A7_3C10D18ECE17_0/r/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D60047E_7E13_9472_41A7_3C10D18ECE17_0/r/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6D60047E_7E13_9472_41A7_3C10D18ECE17_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D60047E_7E13_9472_41A7_3C10D18ECE17_0/b/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D60047E_7E13_9472_41A7_3C10D18ECE17_0/b/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D60047E_7E13_9472_41A7_3C10D18ECE17_0/d/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D60047E_7E13_9472_41A7_3C10D18ECE17_0/d/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D60047E_7E13_9472_41A7_3C10D18ECE17_0/l/0/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6D60047E_7E13_9472_41A7_3C10D18ECE17_0/l/1/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_6D60047E_7E13_9472_41A7_3C10D18ECE17",
 "label": "9",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_6D60047E_7E13_9472_41A7_3C10D18ECE17_t.jpg",
 "partial": false,
 "class": "Panorama",
 "overlays": [
  "this.overlay_6EF5A5F7_7E72_B472_41B3_E2BCBD60596B",
  "this.overlay_69FF6892_7E75_FCB2_41CD_DDA32F871612",
  "this.overlay_690DC809_7E73_FB9E_41DC_ED006BCB1C7D"
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": -139.1,
   "class": "AdjacentPanorama",
   "backwardYaw": 1.67,
   "panorama": "this.panorama_6D671D92_7E13_94B2_41D1_1730F48F588E"
  },
  {
   "distance": 1,
   "yaw": 0.78,
   "class": "AdjacentPanorama",
   "backwardYaw": 6.52,
   "panorama": "this.panorama_6C20B486_7E13_7492_41B0_CDD3048245FF"
  }
 ]
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_6C20B486_7E13_7492_41B0_CDD3048245FF_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": -179.16,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_6DA051DE_7ED8_D205_41DA_F507F8399215",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 168.23,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_6DB671C8_7ED8_D20C_41D0_6E0AFC817DC2",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_6D7D394E_7E13_9D95_41D0_72A8F3EDC322_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_6D671D92_7E13_94B2_41D1_1730F48F588E_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "progressBarBorderColor": "#000000",
 "id": "MainViewer",
 "toolTipBorderColor": "#767676",
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "progressBorderColor": "#000000",
 "toolTipShadowSpread": 0,
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipOpacity": 1,
 "shadow": false,
 "width": "100%",
 "toolTipFontSize": "1.11vmin",
 "playbackBarHeight": 10,
 "toolTipShadowBlurRadius": 3,
 "playbackBarHeadWidth": 6,
 "playbackBarRight": 0,
 "toolTipTextShadowColor": "#000000",
 "playbackBarBackgroundColorDirection": "vertical",
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipTextShadowBlurRadius": 3,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "progressBarBorderSize": 0,
 "toolTipPaddingBottom": 4,
 "playbackBarProgressBorderSize": 0,
 "paddingRight": 0,
 "toolTipShadowColor": "#333333",
 "playbackBarBorderRadius": 0,
 "minHeight": 50,
 "playbackBarProgressBorderColor": "#000000",
 "toolTipFontWeight": "normal",
 "paddingBottom": 0,
 "class": "ViewerArea",
 "playbackBarHeadBorderColor": "#000000",
 "toolTipShadowOpacity": 1,
 "progressLeft": 0,
 "toolTipFontStyle": "normal",
 "playbackBarProgressOpacity": 1,
 "playbackBarHeadBorderRadius": 0,
 "height": "100%",
 "playbackBarBorderSize": 0,
 "playbackBarHeadBorderSize": 0,
 "transitionMode": "blending",
 "playbackBarBackgroundOpacity": 1,
 "toolTipShadowHorizontalLength": 0,
 "propagateClick": false,
 "toolTipTextShadowOpacity": 0,
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "transitionDuration": 500,
 "toolTipShadowVerticalLength": 0,
 "minWidth": 100,
 "playbackBarHeadShadowColor": "#000000",
 "toolTipFontFamily": "Arial",
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarHeadShadow": true,
 "progressBottom": 0,
 "progressHeight": 10,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontColor": "#606060",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "borderSize": 0,
 "playbackBarHeadShadowOpacity": 0.7,
 "vrPointerColor": "#FFFFFF",
 "progressBarOpacity": 1,
 "paddingLeft": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderSize": 0,
 "displayTooltipInTouchScreens": true,
 "toolTipBorderSize": 1,
 "toolTipPaddingRight": 6,
 "toolTipPaddingLeft": 6,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "toolTipPaddingTop": 4,
 "toolTipDisplayTime": 600,
 "playbackBarHeadHeight": 15,
 "playbackBarLeft": 0,
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBorderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "data": {
  "name": "Main Viewer"
 },
 "progressBarBackgroundColorRatios": [
  0
 ],
 "progressBackgroundColorDirection": "vertical",
 "playbackBarHeadOpacity": 1,
 "playbackBarBottom": 5,
 "paddingTop": 0
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 01c"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D63D235_7E13_8FF6_41B9_B7F8A6C7F072_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 158.03,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 25.61,
   "pitch": -24.4
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_6CC9CDF8_7E69_720C_41D9_9D9392CBDC24",
   "pitch": -24.4,
   "yaw": 158.03,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 25.61,
   "distance": 100
  }
 ],
 "id": "overlay_654E8399_7E6F_8CBE_41B2_C7244D1B081D",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6D71EDE6_7E13_9495_41D1_6DC79DDF43CA, this.camera_6C4B3156_7ED8_D205_41C8_51B3C6D86313); this.mainPlayList.set('selectedIndex', 4)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 01c"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6C20B486_7E13_7492_41B0_CDD3048245FF_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 6.52,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 18.88,
   "pitch": 0.02
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_6665EB0F_7E12_BD92_41D4_3FE2898DE98F",
   "pitch": 0.02,
   "yaw": 6.52,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 18.88,
   "distance": 100
  }
 ],
 "id": "overlay_679DD4CF_7E6D_B492_41C4_3CA6DF24FF7D",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6D60047E_7E13_9472_41A7_3C10D18ECE17, this.camera_6A4950FA_7ED8_D20C_41D4_052B6B25A5B7); this.mainPlayList.set('selectedIndex', 7)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 01c"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6C20B486_7E13_7492_41B0_CDD3048245FF_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -151.89,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 18.4,
   "pitch": -12.89
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_66664B0F_7E12_BD92_41DD_5E300D608069",
   "pitch": -12.89,
   "yaw": -151.89,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 18.4,
   "distance": 100
  }
 ],
 "id": "overlay_6477CFA5_7E12_B496_41A0_EF6D02C06FF0",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC, this.camera_6A5290EC_7ED8_D205_41DB_681209081C9A); this.mainPlayList.set('selectedIndex', 2)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 01c"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D7D394E_7E13_9D95_41D0_72A8F3EDC322_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 113.98,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 36.22,
   "pitch": -5.59
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_648636B9_7E76_94FF_41C0_2DFE6BD90500",
   "pitch": -5.59,
   "yaw": 113.98,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 36.22,
   "distance": 100
  }
 ],
 "id": "overlay_68D99A25_7E7E_BF97_41CD_29D0FEAFEF1D",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6D61F230_7E13_8F8D_41B2_7EA071556384, this.camera_6D9441A8_7ED8_D20C_41C3_E7F632E374D3); this.mainPlayList.set('selectedIndex', 10)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 01c"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D7D394E_7E13_9D95_41D0_72A8F3EDC322_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -100.17,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 36.4,
   "pitch": -0.23
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_706DA9E8_7E5B_520C_41C9_98C75FD5CC35",
   "pitch": -0.23,
   "yaw": -100.17,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 36.4,
   "distance": 100
  }
 ],
 "id": "overlay_665B5B9D_7E13_BCB7_41B2_9871047EC47B",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_70829F19_7E6B_2E0C_41CB_416A3F86CAC0, this.camera_6D8DC1B2_7ED8_D21C_41D1_E2E4E4CF7AA6); this.mainPlayList.set('selectedIndex', 11)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 01b"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D671D92_7E13_94B2_41D1_1730F48F588E_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 1.67,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 19.29,
   "pitch": -4.02
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_648696BA_7E76_94F2_41DD_34D3BE67B265",
   "pitch": -4.02,
   "yaw": 1.67,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 19.29,
   "distance": 100
  }
 ],
 "id": "overlay_68D307E8_7E72_F49D_41BF_AA2B4653244D",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6D60047E_7E13_9472_41A7_3C10D18ECE17, this.camera_6DE24221_7ED8_D63C_41B1_9D5E37C54083); this.mainPlayList.set('selectedIndex', 7)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02c Right"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D671D92_7E13_94B2_41D1_1730F48F588E_0_HS_1_0_0_map.gif",
      "width": 26,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 104.04,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 27.92,
   "pitch": -25.88
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_65324650_7E15_778E_4181_9E55A020B7E9",
   "pitch": -25.88,
   "yaw": 104.04,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 27.92,
   "distance": 50
  }
 ],
 "id": "overlay_64E2DF88_7E15_B49E_41D3_2DB1EA8E8F9B",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6D61F230_7E13_8F8D_41B2_7EA071556384, this.camera_6DEFA215_7ED8_D604_41D5_57CF799E3A79); this.mainPlayList.set('selectedIndex', 10)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 01c"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 110.02,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 18.82,
   "pitch": -4.51
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_6A05D997_7E76_FCB3_41B7_5C2A6639AD70",
   "pitch": -4.51,
   "yaw": 110.02,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 18.82,
   "distance": 100
  }
 ],
 "id": "overlay_6A383BE3_7E77_BC92_41DF_2237D2C51D3A",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6C20B486_7E13_7492_41B0_CDD3048245FF, this.camera_6DD631E9_7ED8_D20C_4196_EEDFBBDC5C78); this.mainPlayList.set('selectedIndex', 1)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 01c"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -81.61,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 18.56,
   "pitch": -10.42
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_654FF3D5_7E73_8CB6_41A4_02A6B4CF0789",
   "pitch": -10.42,
   "yaw": -81.61,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 18.56,
   "distance": 100
  }
 ],
 "id": "overlay_65A46DCE_7E75_B492_41DC_653C4A19E051",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6D71D738_7E13_95FE_41D4_EF0BFC47C54F, this.camera_6DCCD1F3_7ED8_D21C_41DF_6E247C44BE8D); this.mainPlayList.set('selectedIndex', 3)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC_0_HS_2_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 0.84,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 13.21,
   "pitch": -5.59
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC_0_HS_2_0.png",
      "width": 151,
      "class": "ImageResourceLevel",
      "height": 151
     }
    ]
   },
   "pitch": -5.59,
   "yaw": 0.84,
   "hfov": 13.21
  }
 ],
 "id": "overlay_65E0E6A6_7E72_9492_41C8_C2AD9718DF38",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9, this.camera_6DC2B1FF_7ED8_D204_41D5_D775D6E62F15); this.mainPlayList.set('selectedIndex', 0)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 01c"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D6176AC_7E13_B496_41D7_FCC6C4EE6DA4_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 116.91,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 17.87,
   "pitch": -22.42
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_650223BC_7E6E_8CF6_41DE_969D7A1E5B9D",
   "pitch": -22.42,
   "yaw": 116.91,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 17.87,
   "distance": 100
  }
 ],
 "id": "overlay_65E4CE67_7E6D_9793_41D1_67D18A796EB7",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 5)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 01c"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D71D738_7E13_95FE_41D4_EF0BFC47C54F_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 1.58,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 18.77,
   "pitch": -5.95
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_6480E6B9_7E76_94FF_41CB_C783C4FA353C",
   "pitch": -5.95,
   "yaw": 1.58,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 18.77,
   "distance": 100
  }
 ],
 "id": "overlay_6A35367D_7E75_B476_41DD_3E28FEA56724",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC, this.camera_6D80F1BD_7ED8_D204_41CC_017BE693FD81); this.mainPlayList.set('selectedIndex', 2)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D71D738_7E13_95FE_41D4_EF0BFC47C54F_0_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -63.82,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 13.05,
   "pitch": -10.53
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D71D738_7E13_95FE_41D4_EF0BFC47C54F_0_HS_1_0.png",
      "width": 151,
      "class": "ImageResourceLevel",
      "height": 151
     }
    ]
   },
   "pitch": -10.53,
   "yaw": -63.82,
   "hfov": 13.05
  }
 ],
 "id": "overlay_6AB53E21_7E75_B791_41DD_66EEAAAC7780",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9, this.camera_6DB671C8_7ED8_D20C_41D0_6E0AFC817DC2); this.mainPlayList.set('selectedIndex', 0)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 01c"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7011F3C4_7E6B_5604_41C5_69B87471F82C_1_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 1.53,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 17.92,
   "pitch": -22.07
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_6C930D9E_7E77_D204_41DE_C8E63D5BF732",
   "pitch": -22.07,
   "yaw": 1.53,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 17.92,
   "distance": 100
  }
 ],
 "id": "overlay_71E357DE_7E69_DE04_41D5_1A827FCFEC28",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_70113C6A_7E6B_520C_41D0_D66386913170, this.camera_6C7BE17A_7ED8_D20D_41D3_48A5AF066068); this.mainPlayList.set('selectedIndex', 14)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 01c"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7011F3C4_7E6B_5604_41C5_69B87471F82C_1_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 167.95,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 16.68,
   "pitch": -21.41
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_6C92BD9F_7E77_D204_41D8_AF2D2E02032C",
   "pitch": -21.41,
   "yaw": 167.95,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 16.68,
   "distance": 100
  }
 ],
 "id": "overlay_6F419648_7E69_DE0C_41DF_0CD4C050382A",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7016A819_7E6B_520C_41C7_14EE9A141AAE, this.camera_6C738186_7ED8_D204_41DE_351E6E3EECAA); this.mainPlayList.set('selectedIndex', 13)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 01c"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7016A819_7E6B_520C_41C7_14EE9A141AAE_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -145.14,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 17.72,
   "pitch": -23.58
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_6E0DD126_7E79_7205_41D2_F349E4037634",
   "pitch": -23.58,
   "yaw": -145.14,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 17.72,
   "distance": 100
  }
 ],
 "id": "overlay_6F550E09_7E78_EE0C_41D1_6DC592C66F64",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7011F3C4_7E6B_5604_41C5_69B87471F82C, this.camera_6DF9520A_7ED8_D60C_41C9_8E493233AADF); this.mainPlayList.set('selectedIndex', 12)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 01c"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D61F230_7E13_8F8D_41B2_7EA071556384_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 34.21,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 16.12,
   "pitch": -33.53
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_6486E6BA_7E76_94F2_41C3_84117282FC6C",
   "pitch": -33.53,
   "yaw": 34.21,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 16.12,
   "distance": 100
  }
 ],
 "id": "overlay_683B9102_7E7D_8D92_41D4_2B9224C808E0",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6D671D92_7E13_94B2_41D1_1730F48F588E, this.camera_6C53E13C_7ED8_D204_41C4_2C68FF2402AD); this.mainPlayList.set('selectedIndex', 9)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 01c"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D61F230_7E13_8F8D_41B2_7EA071556384_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 90.76,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 18.61,
   "pitch": -15.76
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_66F3B55B_7E15_95B2_41C4_9EA739F43C50",
   "pitch": -15.76,
   "yaw": 90.76,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 18.61,
   "distance": 100
  }
 ],
 "id": "overlay_6440AD6D_7E15_9596_41D2_1E5EFC663136",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6D7D394E_7E13_9D95_41D0_72A8F3EDC322, this.camera_6C4EA148_7ED8_D20C_41B1_CFF3F56EEAB1); this.mainPlayList.set('selectedIndex', 8)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D71EDE6_7E13_9495_41D1_6DC79DDF43CA_0_HS_0_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -60.07,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 23.95,
   "pitch": -15.73
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D71EDE6_7E13_9495_41D1_6DC79DDF43CA_0_HS_0_0.png",
      "width": 97,
      "class": "ImageResourceLevel",
      "height": 96
     }
    ]
   },
   "pitch": -15.73,
   "yaw": -60.07,
   "hfov": 23.95
  }
 ],
 "id": "overlay_65A785EB_7E73_9493_41B6_355FC2A9FF49",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 0)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 01c"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D71EDE6_7E13_9495_41D1_6DC79DDF43CA_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 152.74,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 28.07,
   "pitch": -3.67
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_6C961D98_7E77_D20C_41C4_77F3649CDCBD",
   "pitch": -3.67,
   "yaw": 152.74,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 28.07,
   "distance": 100
  }
 ],
 "id": "overlay_717845A2_7E58_F23C_41D3_2C58FAF96F19",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6D63D235_7E13_8FF6_41B9_B7F8A6C7F072, this.camera_6D16422E_7ED8_D605_41D4_9DE2B749D1F9); this.mainPlayList.set('selectedIndex', 5)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 01c"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6F35E656_7E78_DE04_41D0_25066611AE2E_1_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 40.8,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 28.3,
   "pitch": -12.13
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_6BAC8EDA_7E77_2E0C_41C9_61A447B17B70",
   "pitch": -12.13,
   "yaw": 40.8,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 28.3,
   "distance": 100
  }
 ],
 "id": "overlay_6CDCA4B8_7E77_D20D_419B_89509C36BC9D",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 4)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 01c"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_70829F19_7E6B_2E0C_41CB_416A3F86CAC0_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 169.4,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 20.15,
   "pitch": -18.21
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_6C4507A2_7E79_7E3C_41D7_DB39DC721796",
   "pitch": -18.21,
   "yaw": 169.4,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 20.15,
   "distance": 100
  }
 ],
 "id": "overlay_6FF4EF83_7E7F_EEFC_41BD_AC154DAB2E11",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6D7D394E_7E13_9D95_41D0_72A8F3EDC322, this.camera_6C41C16F_7ED8_D204_41CC_7A3B3B92637D); this.mainPlayList.set('selectedIndex', 8)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 01c"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_70113C6A_7E6B_520C_41D0_D66386913170_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -97.67,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 19.33,
   "pitch": 1.43
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_6AA81BD0_7E79_F61D_41D6_5196EC30CCB5",
   "pitch": 1.43,
   "yaw": -97.67,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 19.33,
   "distance": 100
  }
 ],
 "id": "overlay_6F4D8991_7E79_521C_41A5_0C98E3655933",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7011F3C4_7E6B_5604_41C5_69B87471F82C, this.camera_6C47B164_7ED8_D204_41C4_72633E90E6AF); this.mainPlayList.set('selectedIndex', 12)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 01c"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_70113C6A_7E6B_520C_41D0_D66386913170_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 102.56,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 19.19,
   "pitch": -6.97
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_6AA84BD1_7E79_F61F_41B5_C024D0B0CC2E",
   "pitch": -6.97,
   "yaw": 102.56,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 19.19,
   "distance": 100
  }
 ],
 "id": "overlay_6F20F9FC_7E7B_3204_41D7_C13598C9C15D",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 11)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9_0_HS_0_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -11.77,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 1.32,
   "pitch": -2.93
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9_0_HS_0_0.png",
      "width": 69,
      "class": "ImageResourceLevel",
      "height": 73
     }
    ]
   },
   "pitch": -2.93,
   "yaw": -11.77,
   "hfov": 1.32
  }
 ],
 "id": "overlay_6A50E742_7A36_B592_41B3_A3326BBBC8CA",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6D71D738_7E13_95FE_41D4_EF0BFC47C54F, this.camera_6DAD71D3_7ED8_D21C_4199_B208A9B29EEA); this.mainPlayList.set('selectedIndex', 3)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9_0_HS_1_0_0_map.gif",
      "width": 30,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -5.79,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 1.46,
   "pitch": -0.67
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9_0_HS_1_0.png",
      "width": 76,
      "class": "ImageResourceLevel",
      "height": 40
     }
    ]
   },
   "pitch": -0.67,
   "yaw": -5.79,
   "hfov": 1.46
  }
 ],
 "id": "overlay_6A9E4BCD_7A15_7C96_41D1_33CEDF2F5EB0",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC, this.camera_6DA051DE_7ED8_D205_41DA_F507F8399215); this.mainPlayList.set('selectedIndex', 2)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9_0_HS_2_0_0_map.gif",
      "width": 25,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -0.78,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 1.22,
   "pitch": 0.95
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9_0_HS_2_0.png",
      "width": 64,
      "class": "ImageResourceLevel",
      "height": 40
     }
    ]
   },
   "pitch": 0.95,
   "yaw": -0.78,
   "hfov": 1.22
  }
 ],
 "id": "overlay_6DACD295_7FFD_8CB7_41D8_17905E13B8DF",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 1)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9_0_HS_3_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 18
     }
    ]
   },
   "yaw": 9.67,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 1.05,
   "pitch": 0.76
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9_0_HS_3_0.png",
      "width": 55,
      "class": "ImageResourceLevel",
      "height": 63
     }
    ]
   },
   "pitch": 0.76,
   "yaw": 9.67,
   "hfov": 1.05
  }
 ],
 "id": "overlay_6DACC900_7FFE_9D8E_4182_EA11A440E210",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 8)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9_0_HS_5_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 20
     }
    ]
   },
   "yaw": 4.62,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 0.82,
   "pitch": 2.2
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9_0_HS_5_0.png",
      "width": 43,
      "class": "ImageResourceLevel",
      "height": 54
     }
    ]
   },
   "pitch": 2.2,
   "yaw": 4.62,
   "hfov": 0.82
  }
 ],
 "id": "overlay_6D9AB4CC_7FFE_9496_41C3_7D7302B763F6",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 15)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9_0_HS_6_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 23
     }
    ]
   },
   "yaw": 3.87,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 0.7,
   "pitch": 2.76
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9_0_HS_6_0.png",
      "width": 36,
      "class": "ImageResourceLevel",
      "height": 53
     }
    ]
   },
   "pitch": 2.76,
   "yaw": 3.87,
   "hfov": 0.7
  }
 ],
 "id": "overlay_6D7A3EFD_7FFD_F476_41D6_867A0AD516AF",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 5)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9_0_HS_7_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 18
     }
    ]
   },
   "yaw": 3.99,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 0.86,
   "pitch": 3.45
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9_0_HS_7_0.png",
      "width": 45,
      "class": "ImageResourceLevel",
      "height": 51
     }
    ]
   },
   "pitch": 3.45,
   "yaw": 3.99,
   "hfov": 0.86
  }
 ],
 "id": "overlay_6D96BDC8_7FF2_949E_41D6_F74EFAC7A9A9",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 6)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9_0_HS_8_0_0_map.gif",
      "width": 18,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 5.63,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 0.9,
   "pitch": 2.68
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9_0_HS_8_0.png",
      "width": 47,
      "class": "ImageResourceLevel",
      "height": 41
     }
    ]
   },
   "pitch": 2.68,
   "yaw": 5.63,
   "hfov": 0.9
  }
 ],
 "id": "overlay_6D27AD20_7FF2_958E_419F_42921CB27BC7",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 13)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9_0_HS_10_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 17
     }
    ]
   },
   "yaw": 1.89,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 0.76,
   "pitch": 1.76
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6ACE4A5D_7A1D_BFB6_41D3_649BE14A5BF9_0_HS_10_0.png",
      "width": 40,
      "class": "ImageResourceLevel",
      "height": 43
     }
    ]
   },
   "pitch": 1.76,
   "yaw": 1.89,
   "hfov": 0.76
  }
 ],
 "id": "overlay_6F22FA6A_7E6E_FF92_41C4_F823980FFA71",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 7)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 01c"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D60047E_7E13_9472_41A7_3C10D18ECE17_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 0.78,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 18.62,
   "pitch": -15.69
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_6B498F3E_7E75_95F2_41D9_4A73B91170E7",
   "pitch": -15.69,
   "yaw": 0.78,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 18.62,
   "distance": 100
  }
 ],
 "id": "overlay_6EF5A5F7_7E72_B472_41B3_E2BCBD60596B",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6C20B486_7E13_7492_41B0_CDD3048245FF, this.camera_6C61419C_7ED8_D204_41BA_CF3BBC7891DE); this.mainPlayList.set('selectedIndex', 1)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 01b"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D60047E_7E13_9472_41A7_3C10D18ECE17_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -167.17,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 19.32,
   "pitch": -2.17
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_6B496F3F_7E75_95F2_41B3_B6C85D7BCDEE",
   "pitch": -2.17,
   "yaw": -167.17,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 19.32,
   "distance": 100
  }
 ],
 "id": "overlay_69FF6892_7E75_FCB2_41CD_DDA32F871612",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "useHandCursor": true,
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 01b"
 },
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D60047E_7E13_9472_41A7_3C10D18ECE17_0_HS_2_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -139.1,
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 19.29,
   "pitch": -3.95
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_6481F6B9_7E76_94FF_41CA_13E028F750B1",
   "pitch": -3.95,
   "yaw": -139.1,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 19.29,
   "distance": 100
  }
 ],
 "id": "overlay_690DC809_7E73_FB9E_41DC_ED006BCB1C7D",
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6D671D92_7E13_94B2_41D1_1730F48F588E, this.camera_6C683190_7ED8_D21C_41D5_8AEFC2CBBBB6); this.mainPlayList.set('selectedIndex', 9)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ]
},
{
 "rowCount": 3,
 "levels": [
  {
   "url": "media/panorama_6D63D235_7E13_8FF6_41B9_B7F8A6C7F072_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_6CC9CDF8_7E69_720C_41D9_9D9392CBDC24",
 "class": "AnimatedImageResource",
 "frameCount": 9
},
{
 "rowCount": 3,
 "levels": [
  {
   "url": "media/panorama_6C20B486_7E13_7492_41B0_CDD3048245FF_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_6665EB0F_7E12_BD92_41D4_3FE2898DE98F",
 "class": "AnimatedImageResource",
 "frameCount": 9
},
{
 "rowCount": 3,
 "levels": [
  {
   "url": "media/panorama_6C20B486_7E13_7492_41B0_CDD3048245FF_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_66664B0F_7E12_BD92_41DD_5E300D608069",
 "class": "AnimatedImageResource",
 "frameCount": 9
},
{
 "rowCount": 3,
 "levels": [
  {
   "url": "media/panorama_6D7D394E_7E13_9D95_41D0_72A8F3EDC322_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_648636B9_7E76_94FF_41C0_2DFE6BD90500",
 "class": "AnimatedImageResource",
 "frameCount": 9
},
{
 "rowCount": 3,
 "levels": [
  {
   "url": "media/panorama_6D7D394E_7E13_9D95_41D0_72A8F3EDC322_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_706DA9E8_7E5B_520C_41C9_98C75FD5CC35",
 "class": "AnimatedImageResource",
 "frameCount": 9
},
{
 "rowCount": 3,
 "levels": [
  {
   "url": "media/panorama_6D671D92_7E13_94B2_41D1_1730F48F588E_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_648696BA_7E76_94F2_41DD_34D3BE67B265",
 "class": "AnimatedImageResource",
 "frameCount": 9
},
{
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_6D671D92_7E13_94B2_41D1_1730F48F588E_0_HS_1_0.png",
   "width": 400,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ],
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_65324650_7E15_778E_4181_9E55A020B7E9",
 "class": "AnimatedImageResource",
 "frameCount": 24
},
{
 "rowCount": 3,
 "levels": [
  {
   "url": "media/panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_6A05D997_7E76_FCB3_41B7_5C2A6639AD70",
 "class": "AnimatedImageResource",
 "frameCount": 9
},
{
 "rowCount": 3,
 "levels": [
  {
   "url": "media/panorama_6D70F06E_7E13_8B92_418F_0FC8C6621AFC_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_654FF3D5_7E73_8CB6_41A4_02A6B4CF0789",
 "class": "AnimatedImageResource",
 "frameCount": 9
},
{
 "rowCount": 3,
 "levels": [
  {
   "url": "media/panorama_6D6176AC_7E13_B496_41D7_FCC6C4EE6DA4_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_650223BC_7E6E_8CF6_41DE_969D7A1E5B9D",
 "class": "AnimatedImageResource",
 "frameCount": 9
},
{
 "rowCount": 3,
 "levels": [
  {
   "url": "media/panorama_6D71D738_7E13_95FE_41D4_EF0BFC47C54F_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_6480E6B9_7E76_94FF_41CB_C783C4FA353C",
 "class": "AnimatedImageResource",
 "frameCount": 9
},
{
 "rowCount": 3,
 "levels": [
  {
   "url": "media/panorama_7011F3C4_7E6B_5604_41C5_69B87471F82C_1_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_6C930D9E_7E77_D204_41DE_C8E63D5BF732",
 "class": "AnimatedImageResource",
 "frameCount": 9
},
{
 "rowCount": 3,
 "levels": [
  {
   "url": "media/panorama_7011F3C4_7E6B_5604_41C5_69B87471F82C_1_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_6C92BD9F_7E77_D204_41D8_AF2D2E02032C",
 "class": "AnimatedImageResource",
 "frameCount": 9
},
{
 "rowCount": 3,
 "levels": [
  {
   "url": "media/panorama_7016A819_7E6B_520C_41C7_14EE9A141AAE_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_6E0DD126_7E79_7205_41D2_F349E4037634",
 "class": "AnimatedImageResource",
 "frameCount": 9
},
{
 "rowCount": 3,
 "levels": [
  {
   "url": "media/panorama_6D61F230_7E13_8F8D_41B2_7EA071556384_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_6486E6BA_7E76_94F2_41C3_84117282FC6C",
 "class": "AnimatedImageResource",
 "frameCount": 9
},
{
 "rowCount": 3,
 "levels": [
  {
   "url": "media/panorama_6D61F230_7E13_8F8D_41B2_7EA071556384_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_66F3B55B_7E15_95B2_41C4_9EA739F43C50",
 "class": "AnimatedImageResource",
 "frameCount": 9
},
{
 "rowCount": 3,
 "levels": [
  {
   "url": "media/panorama_6D71EDE6_7E13_9495_41D1_6DC79DDF43CA_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_6C961D98_7E77_D20C_41C4_77F3649CDCBD",
 "class": "AnimatedImageResource",
 "frameCount": 9
},
{
 "rowCount": 3,
 "levels": [
  {
   "url": "media/panorama_6F35E656_7E78_DE04_41D0_25066611AE2E_1_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_6BAC8EDA_7E77_2E0C_41C9_61A447B17B70",
 "class": "AnimatedImageResource",
 "frameCount": 9
},
{
 "rowCount": 3,
 "levels": [
  {
   "url": "media/panorama_70829F19_7E6B_2E0C_41CB_416A3F86CAC0_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_6C4507A2_7E79_7E3C_41D7_DB39DC721796",
 "class": "AnimatedImageResource",
 "frameCount": 9
},
{
 "rowCount": 3,
 "levels": [
  {
   "url": "media/panorama_70113C6A_7E6B_520C_41D0_D66386913170_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_6AA81BD0_7E79_F61D_41D6_5196EC30CCB5",
 "class": "AnimatedImageResource",
 "frameCount": 9
},
{
 "rowCount": 3,
 "levels": [
  {
   "url": "media/panorama_70113C6A_7E6B_520C_41D0_D66386913170_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_6AA84BD1_7E79_F61F_41B5_C024D0B0CC2E",
 "class": "AnimatedImageResource",
 "frameCount": 9
},
{
 "rowCount": 3,
 "levels": [
  {
   "url": "media/panorama_6D60047E_7E13_9472_41A7_3C10D18ECE17_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_6B498F3E_7E75_95F2_41D9_4A73B91170E7",
 "class": "AnimatedImageResource",
 "frameCount": 9
},
{
 "rowCount": 3,
 "levels": [
  {
   "url": "media/panorama_6D60047E_7E13_9472_41A7_3C10D18ECE17_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_6B496F3F_7E75_95F2_41B3_B6C85D7BCDEE",
 "class": "AnimatedImageResource",
 "frameCount": 9
},
{
 "rowCount": 3,
 "levels": [
  {
   "url": "media/panorama_6D60047E_7E13_9472_41A7_3C10D18ECE17_0_HS_2_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_6481F6B9_7E76_94FF_41CA_13E028F750B1",
 "class": "AnimatedImageResource",
 "frameCount": 9
}]
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
