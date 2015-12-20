angular.module('sculptClient')

.controller('CanvasController', function ($http, $element, socket) {

	var canvas = $(root.ns('classes.Renderer').renderer.domElement).attr('id', 'canvas');

	var sceneHandler = root.ns('classes.CustomSceneHandler').create(socket, $element);
	$('#app').append(canvas);
	
    var resizeCanvas = function resizeCanvas() {
        
        var canvas = root.ns('classes.Renderer').renderer;
        canvas.setSize( window.innerWidth - 6, window.innerHeight - 6);
    }

    window.addEventListener('resize', resizeCanvas, false);

    resizeCanvas();

});