/**
 * Created by aghassaei on 1/17/15.
 */


function ThreeModel(){

    var camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 10000);
    var scene = new THREE.Scene();
    var renderer = new THREE.WebGLRenderer({antialias:true});//antialiasing is not supported in ff and on mac+chrome

    //store all meshes to highlight
    var cells = [];
    var parts = [];
    var basePlane = [];

    var animationLoopRunning = false;
    var stopAnimationFlag = false;

    initialize();

    function initialize(){

        camera.position.x = 125;
        camera.position.y = 100;
        camera.position.z = 165;
        camera.up.set(0,0,1);//set z axis as "up"

        scene.fog = new THREE.FogExp2(0xcccccc, 0.000);

        // lights
        var light = new THREE.DirectionalLight(0xffffff);
        light.position.set(1, 1, 1);
        scene.add(light);
        light = new THREE.DirectionalLight(0xaaaaaa);
        light.position.set(-1, -1, -1);
        scene.add(light);
        light = new THREE.AmbientLight(0x222222);
        scene.add(light);

        // renderer
        renderer.setClearColor(scene.fog.color, 1);
        renderer.setSize(window.innerWidth, window.innerHeight);

        window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize(){
        camera.aspect = window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        render();
    }

    function sceneAdd(object, type){
        scene.add(object);

        if (type == "cell"){
            cells.push(object.children[0]);
        } else if (type == "part"){
            parts.push(object);
        } else if (type == "basePlane"){
            basePlane.push(object);
        }
    }

    function sceneRemove(object, type){

        var objectToRemove = getParentObject(object);

        if (type == "cell"){
            cells.splice(cells.indexOf(objectToRemove.children[0]), 1);
        } else if (type == "part"){
            parts.splice(parts.indexOf(objectToRemove), 1);
        } else if (type == "basePlane"){
            basePlane.splice(0, basePlane.length);//delete array without removing reference
        }
        scene.remove(objectToRemove);
    }

    function removeAllCells(){
        _.each(cells, function(cell){
            var objectToRemove = getParentObject(cell);
            scene.remove(objectToRemove);
        });
        _.each(parts, function(part){
            scene.remove(part);
        });
        cells.splice(0, cells.length);
        parts.splice(0, parts.length);
    }

    function getParentObject(object){
        var objectToRemove = object;
        if (object.parent && object.parent.type != "Scene") {
            objectToRemove = object.parent;
        }
        return objectToRemove;
    }

    function startAnimationLoop(){
        if (animationLoopRunning) return;
        stopAnimationFlag = false;
        animationLoopRunning = true;
        console.log("animation started");
        _loop();
    }

    function stopAnimationLoop(){
        if (!animationLoopRunning) return;
        stopAnimationFlag = true;
    }

    function _loop(){
        _render();
        if (stopAnimationFlag) {
            animationLoopRunning = false;
            console.log("animation stopped");
            return;
        }
        requestAnimationFrame(_loop);
    }

    function render(){
        if (animationLoopRunning) return;
        _render();
    }

    function _render(){
        renderer.render(scene, camera);
    }

    return {//return public properties/methods
        render: render,
        startAnimationLoop: startAnimationLoop,
        stopAnimationLoop: stopAnimationLoop,
        sceneRemove: sceneRemove,
        sceneAdd: sceneAdd,
        domElement: renderer.domElement,
        camera: camera,
        cells: cells,
        parts: parts,
        basePlane: basePlane,
        removeAllCells: removeAllCells
    }
}