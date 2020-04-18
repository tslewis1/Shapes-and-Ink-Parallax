// Get reference to canvas 
var canvas = document.getElementById('canvas');
 
// Get reference to canvas context
var context = canvas.getContext('2d');

// Get reference to loading screen
var loading_screen = document.getElementById('loading');

//Initialize loading variable
var loaded = false;
var load_counter = 0;

//Initialize images for layers
var background = new Image();
var shadows = new Image();
var floaty = new Image();
var ink = new Image();
var smallCircles = new Image();
var bigCircles = new Image();
var smallShapes = new Image();
var bigShapes = new Image();
var personShadow = new Image();
var person = new Image();
var maskShadow = new Image();
var mask = new Image();
var frontShapes = new Image();
var frontBubbles = new Image();
var frontLights = new Image();

// Create list of layer objects
var layer_list = [
    {
        'image': background,
        'src': './images/Layer 1_1.png',
        'z_index': -4.25 ,
        'position': {x: 0, y:0},
        'blend': null,
        'opacity': 1
    },
        {
        'image': shadows,
        'src': './images/Layer 2_1.png',
        'z_index': -4,
        'position': {x: 0, y:0},
        'blend': 'overlay',
        'opacity': 1
    },
         {
        'image': floaty,
        'src': './images/Layer 3_1.png',
        'z_index': -3.8,
        'position': {x: 0, y:0},
        'blend': 'overlay',
        'opacity': 1
    },
         {
        'image': ink,
        'src': './images/Layer 4_1.png',
        'z_index': -3.5,
        'position': {x: 0, y:0},
        'blend': null,
        'opacity': 1
    },
         {
        'image': smallCircles,
        'src': './images/Layer 5_1.png',
        'z_index': -3,
        'position': {x: 0, y:0},
        'blend': null,
        'opacity': 1
    },
          {
        'image': bigCircles,
        'src': './images/Layer 6_1.png',
        'z_index': -2.75,
        'position': {x: 0, y:0},
        'blend': null,
        'opacity': 1
    },
          {
        'image': smallShapes,
        'src': './images/Layer 7_1.png',
        'z_index': -2.25,
        'position': {x: 0, y:0},
        'blend': null,
        'opacity': 1
    },
         {
        'image': bigShapes,
        'src': './images/Layer 8_1.png',
        'z_index': -1.75,
        'position': {x: 0, y:0},
        'blend': null,
        'opacity': 1
    },
          {
        'image': personShadow,
        'src': './images/Layer 9_1.png',
        'z_index': -1.25,
        'position': {x: 0, y:0},
        'blend': null,
        'opacity': 0.3
    },
          {
        'image': person,
        'src': './images/Layer 10_1.png',
        'z_index': -1,
        'position': {x: 0, y:0},
        'blend': null,
        'opacity': 1
    },
          {
        'image': maskShadow,
        'src': './images/Layer 11_1.png',
        'z_index': -0.5,
        'position': {x: 0, y:0},
        'blend': null,
        'opacity': 0.3
    },
          {
        'image': mask,
        'src': './images/Layer 12_1.png',
        'z_index': 0,
        'position': {x: 0, y:0},
        'blend': null,
        'opacity': 1
    },
        {
        'image': frontShapes,
        'src': './images/Layer 13_1.png',
        'z_index': 0.8,
        'position': {x: 0, y:0},
        'blend': null,
        'opacity': 1
    },
        {
        'image': frontBubbles,
        'src': './images/Layer 14_1.png',
        'z_index': 1.5,
        'position': {x: 0, y:0},
        'blend': null,
        'opacity': 0.9
    },
        {
        'image': frontLights,
        'src': './images/Layer 15_1.png',
        'z_index': 2.25,
        'position': {x: 0, y:0},
        'blend': null,
        'opacity': 0.9
    }
];

// Go through the list of layer objects and load images from source
layer_list.forEach(function(layer, index) {
    layer.image.onload = function() {
        load_counter += 1;
        if (load_counter >= layer_list.length) {
            // Hide the loading screen
            hideLoading();
            requestAnimationFrame(drawCanvas);
        }
    };
    layer.image.src = layer.src;
});

function hideLoading() {
    loading_screen.classList.add('hidden');

}

// Draw layers in Canvas
function drawCanvas() {
    // Erase everything currently on the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    //Update the tween
    
    TWEEN.update();
    
    // Calculate how much the canvas should be rotated
    var rotate_x = (pointer.y * -0.15) + (motion.y * -1.2);
    var rotate_y = (pointer.x * 0.15) + (motion.x * 1.2);
    
    // Actually rotate the canvas
    canvas.style.transform = "rotateX(" + rotate_x + "deg) rotateY(" + rotate_y + "deg)";
    
    // Loop through each layer in the list and draw it to the canvas
    layer_list.forEach(function(layer, index) {
        
        layer.position = getOffset(layer);

        if (layer.blend) {
            context.globalCompositeOperation = layer.blend;
        } else {
            context.globalCompositeOperation = 'normal';
        }
        
        context.globalAlpha = layer.opacity;
        
        context.drawImage(layer.image, layer.position.x, layer.position.y);
    });
    
    requestAnimationFrame(drawCanvas);
}

// Function to calculate layer offset
function getOffset(layer) {
    var touch_multiplier = 0.3;
    var touch_offset_x = pointer.x * layer.z_index * touch_multiplier;
    var touch_offset_y = pointer.y * layer.z_index * touch_multiplier;
    
    var motion_multiplier = 2.5;
    var motion_offset_x = motion.x * layer.z_index * motion_multiplier;
    var motion_offset_y = motion.y * layer.z_index * motion_multiplier;
    
    var offset = {
        x: touch_offset_x + motion_offset_x,
        y: touch_offset_y + motion_offset_y
    };

    return offset;
}



// Touch and Mouse Controls //
var moving = false;

// Initialize touch and mouse position
var pointer_initial = {
   x: 0,
   y: 0
};

var pointer = {
   x: 0,
   y: 0 
};

canvas.addEventListener('touchstart', pointerStart);
canvas.addEventListener('mousedown', pointerStart);

function pointerStart(event) {
   moving = true;
   if (event.type ==='touchstart') {
       pointer_initial.x = event.touches[0].clientX;
       pointer_initial.y = event.touches[0].clientY;
   } else if (event.type === 'mousedown') {
       pointer_initial.x = event.clientX;
       pointer_initial.y = event.clientY;
   }
}

window.addEventListener('touchmove', pointerMove);
window.addEventListener('mousemove', pointerMove);

function pointerMove(event) {
   event.preventDefault();
   if (moving === true) {
       var current_x = 0;
       var current_y = 0;
       if (event.type === 'touchmove') {
           current_x = event.touches[0].clientX;
           current_y = event.touches[0].clientY;
       } else if (event.type === 'mousemove') {
           current_x = event.clientX;
           current_y = event.clientY;
       }
       pointer.x = current_x - pointer_initial.x;
       pointer.y = current_y - pointer_initial.y;
   }
}

// Add event listeners to mouse and touch moving
canvas.addEventListener('touchmove', function(event) {
    event.preventDefault();
});
canvas.addEventListener('mousemove', function(event) {
    event.preventDefault();
});

window.addEventListener('touchend', function(event) {
    endGesture();
});
window.addEventListener('mouseup', function(event) {
    endGesture();
});


function endGesture() {
    moving = false;
    
    TWEEN.removeAll();
    var pointer_tween = new TWEEN.Tween(pointer).to({x: 0, y: 0}, 300).easing(TWEEN.Easing.Back.Out).start();
}

// Motion Controls //

//Initialize variables for motion-based parallax
var motion_initial = {
    x: null,
    y: null
};

var motion = {
    x: 0,
    y: 0
};

// Listen to gyroscope events
window.addEventListener('deviceOrientation', function(event) {
    // If this is the first time through
    if (!motion_initial.x && !motion_initial.y) {
        motion_initial.x = event.beta;
        motion_initial.y = event.gamma;
    }
    
    if (window.orientation === 0) {
        // The device is in portrait orientation
        motion.x = event.gamma - motion_initial.y;
        motion.y = event.beta - motion_initial.x;
    } else if (window.orientation === 90) {
        // The device is in landscape on its left side
        motion.x = event. beta - motion_initial.x;
        motion.y = event.gamma + motion_initial.y;
    } else if (window.orientation === -90) {
        // The device is in landscape on its right side
        motion.x = -event.beta + motion_initial.x;
        motion.y = event.gamma - motion_initial.y;
    } else {
        // The device is upside-down
        motion.x = -event.gamma + motion_initial.y;
        motion.y = -event.beta + motion_initial.x;
    }
});

window.addEventListener('orientationchange', function(event) {
    motion_initial.x = 0;
    motion_initial.y = 0;
});
