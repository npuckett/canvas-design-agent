const { VerletPhysics2D, VerletParticle2D, VerletSpring2D } = toxi.physics2d;
const { GravityBehavior } = toxi.physics2d.behaviors;
const { Vec2D, Rect } = toxi.geom;

// Physics control variables
const INITIAL_GRAVITY = 0.09;    // Initial gentle gravity
const CLICK_GRAVITY = 0.25;      // Stronger gravity after click
const MIN_SPRING = 0.02;         // Minimum spring strength (slightly higher for stability)
const MAX_SPRING = 0.15;         // Maximum spring strength (slightly lower for more flex)
const SPRING_DISTANCE = 25;      // How far apart points can be to connect
const PHYSICS_DRAG = 0.05;       // Lower drag for more fluid motion
const PARTICLE_SIZE = 4;         // Size of dots

// Mouse interaction parameters
const MOUSE_RADIUS = 80;         // Radius of mouse influence
const MOUSE_FORCE = 0.6;         // Base force multiplier for mouse repulsion
const MOUSE_VELOCITY_MULT = 0.08; // How much mouse velocity affects force

// Ambient motion parameters
const AMBIENT_FORCE = 0.02;      // Subtle random force for constant motion
const AMBIENT_CHANCE = 0.05;     // Chance per frame per particle to get nudged

let sliders = [];
let sliderLabels = [];
let showSliders = false;

function setupSliders() {
  sliders.push(createSlider(0, 1, INITIAL_GRAVITY, 0.01).position(10, 10).style('width', '180px'));
  sliderLabels.push(createP('Initial Gravity').position(10, 30));
  
  sliders.push(createSlider(0, 1, CLICK_GRAVITY, 0.01).position(210, 10).style('width', '180px'));
  sliderLabels.push(createP('Click Gravity').position(210, 30));
  
  sliders.push(createSlider(0, 1, MIN_SPRING, 0.01).position(410, 10).style('width', '180px'));
  sliderLabels.push(createP('Min Spring').position(410, 30));
  
  sliders.push(createSlider(0, 1, MAX_SPRING, 0.01).position(610, 10).style('width', '180px'));
  sliderLabels.push(createP('Max Spring').position(610, 30));
  
  sliders.push(createSlider(0, 100, SPRING_DISTANCE, 1).position(10, 70).style('width', '180px'));
  sliderLabels.push(createP('Spring Distance').position(10, 90));
  
  sliders.push(createSlider(0, 1, PHYSICS_DRAG, 0.01).position(210, 70).style('width', '180px'));
  sliderLabels.push(createP('Physics Drag').position(210, 90));
  
  sliders.push(createSlider(1, 10, PARTICLE_SIZE, 1).position(410, 70).style('width', '180px'));
  sliderLabels.push(createP('Particle Size').position(410, 90));
  
  for (let slider of sliders) {
    slider.hide();
  }
  
  for (let label of sliderLabels) {
    label.hide();
  }
}

function toggleSliders() {
  showSliders = !showSliders;
  for (let slider of sliders) {
    if (showSliders) {
      slider.show();
    } else {
      slider.hide();
    }
  }
  for (let label of sliderLabels) {
    if (showSliders) {
      label.show();
    } else {
      label.hide();
    }
  }
}

// Oscillation control
const OSCILLATION_SPEED = 0.035;  // Slightly faster oscillation for more liveliness

// Gravity float event parameters
const NORMAL_GRAVITY = 0.09;      // Default downward gravity
const FLOAT_GRAVITY_MIN = -0.04;  // Minimum upward float
const FLOAT_GRAVITY_MAX = -0.08;  // Maximum upward float
const FLOAT_DURATION_MIN = 40;    // Minimum frames for float (shorter)
const FLOAT_DURATION_MAX = 90;    // Maximum frames for float
const FLOAT_CHANCE = 0.003;       // Chance per frame to trigger float (less frequent)

// Text variables
const FONT_SIZE = 120;
const TEXT_SAMPLE_FACTOR = 0.1;  // Density of points

let font;
let physics;
let particles = [];
let springs = [];
let textToShow = "DF THESIS";
let gravityBehavior;
let isStrongGravity = false;
let time = 0;  // For oscillation
let isFloating = false;          // Whether currently in float mode
let floatTimer = 0;               // Countdown for float duration
let floatDuration = 0;            // Current float event duration
let currentFloatGravity = 0;      // Current float gravity strength
let prevMouseX = 0;
let prevMouseY = 0;

function preload() {
  font = loadFont('assets/SpaceMono-Bold.ttf');
}

function setup() {
  createCanvas(797, 200);

  setupSliders();
  
  // Initialize physics with drag
  physics = new VerletPhysics2D();
  physics.setDrag(PHYSICS_DRAG);
  
  let bounds = new Rect(10, 10, width-10, height-20);
  physics.setWorldBounds(bounds);
  
  // Add initial gentle gravity
  gravityBehavior = new GravityBehavior(new Vec2D(0, INITIAL_GRAVITY));
  physics.addBehavior(gravityBehavior);

  // Set text properties
  textFont(font);
  textSize(FONT_SIZE);
  
  // Get text bounds for centering
  let bounds_text = font.textBounds(textToShow, 0, 0, FONT_SIZE);
  
  // Get points from text
  let points = font.textToPoints(textToShow, 
                               width/2 - bounds_text.w/2, 
                               height/2 + bounds_text.h/2, 
                               FONT_SIZE, {
    sampleFactor: TEXT_SAMPLE_FACTOR
  });
  
  // Create particles
  for (let pt of points) {
    particles.push(new Particle(pt.x, pt.y));
  }
  
  // Connect nearby points with springs
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let p1 = particles[i];
      let p2 = particles[j];
      let d = dist(p1.x, p1.y, p2.x, p2.y);
      if (d < SPRING_DISTANCE) {
        // Start at the midpoint between min and max
        springs.push(new Spring(p1, p2, (MIN_SPRING + MAX_SPRING) / 2));
      }
    }
  }
}

function draw() {
  background(255);
  
  // Calculate mouse velocity
  let mouseVelX = mouseX - prevMouseX;
  let mouseVelY = mouseY - prevMouseY;
  let mouseSpeed = sqrt(mouseVelX * mouseVelX + mouseVelY * mouseVelY);
  
  // Update spring strengths based on oscillation
  time += OSCILLATION_SPEED;
  
  // Map sine wave (-1 to 1) to spring strength range
  let springStrength = map(sin(time), -1, 1, MIN_SPRING, MAX_SPRING);
  
  // Update all springs
  for (let spring of springs) {
    spring.setStrength(springStrength);
  }
  
  // Handle gravity float events
  let targetGravity = NORMAL_GRAVITY;
  
  if (isFloating) {
    // Currently floating - use float gravity and count down
    floatTimer--;
    // Ease out of float as timer runs down
    let floatProgress = floatTimer / floatDuration;
    targetGravity = lerp(NORMAL_GRAVITY, currentFloatGravity, floatProgress);
    
    if (floatTimer <= 0) {
      isFloating = false;
    }
  } else {
    // Not floating - chance to start a float event
    if (random() < FLOAT_CHANCE) {
      isFloating = true;
      floatDuration = floor(random(FLOAT_DURATION_MIN, FLOAT_DURATION_MAX));
      floatTimer = floatDuration;
      currentFloatGravity = random(FLOAT_GRAVITY_MIN, FLOAT_GRAVITY_MAX);
    }
  }
  
  physics.removeBehavior(gravityBehavior);
  gravityBehavior = new GravityBehavior(new Vec2D(0, targetGravity));
  physics.addBehavior(gravityBehavior);
  
  // Apply mouse repulsion force to nearby particles
  for (let particle of particles) {
    let dx = particle.x - mouseX;
    let dy = particle.y - mouseY;
    let d = sqrt(dx * dx + dy * dy);
    
    // Mouse repulsion - particles push away from cursor
    if (d < MOUSE_RADIUS && d > 0) {
      // Force falls off with distance (stronger when closer)
      let forceMagnitude = (1 - d / MOUSE_RADIUS) * MOUSE_FORCE;
      
      // Add velocity-based boost - faster mouse = stronger push
      forceMagnitude += mouseSpeed * MOUSE_VELOCITY_MULT * (1 - d / MOUSE_RADIUS);
      
      // Normalize direction and apply force
      let fx = (dx / d) * forceMagnitude;
      let fy = (dy / d) * forceMagnitude;
      
      particle.addForce(new Vec2D(fx, fy));
    }
    
    // Ambient random motion - keeps things lively
    if (random() < AMBIENT_CHANCE) {
      let ax = random(-AMBIENT_FORCE, AMBIENT_FORCE);
      let ay = random(-AMBIENT_FORCE, AMBIENT_FORCE);
      particle.addForce(new Vec2D(ax, ay));
    }
  }
  
  // Store previous mouse position for velocity calculation
  prevMouseX = mouseX;
  prevMouseY = mouseY;
  
  physics.update();

  // Draw all springs first
  stroke(0, 100);
  strokeWeight(1);
  for (let spring of springs) {
    spring.show();
  }

  // Then draw all particles
  for (let particle of particles) {
    particle.show();
  }

  // When mouse is pressed, create stronger attraction to pull particles
  if (mouseIsPressed) {
    for (let particle of particles) {
      let dx = mouseX - particle.x;
      let dy = mouseY - particle.y;
      let d = sqrt(dx * dx + dy * dy);
      
      // Attract particles within a larger radius when clicking
      if (d < MOUSE_RADIUS * 1.5 && d > 5) {
        let attractForce = 0.8 * (1 - d / (MOUSE_RADIUS * 1.5));
        let fx = (dx / d) * attractForce;
        let fy = (dy / d) * attractForce;
        particle.addForce(new Vec2D(fx, fy));
      }
    }
    
    // Also directly move the closest particle for precise control
    let closest = null;
    let minDist = 30;
    for (let particle of particles) {
      let d = dist(mouseX, mouseY, particle.x, particle.y);
      if (d < minDist) {
        closest = particle;
        minDist = d;
      }
    }
    if (closest) {
      closest.lock();
      closest.x = mouseX;
      closest.y = mouseY;
      closest.unlock();
    }
  }
}

function keyReleased() {
  if (key === ' ') {
    toggleSliders();
  }
  if (key === 'r' || key === 'R') {
    // Generate random gravity value between -CLICK_GRAVITY and CLICK_GRAVITY
    let randomGravity = random(-CLICK_GRAVITY, CLICK_GRAVITY);
    
    // Remove current gravity behavior
    physics.removeBehavior(gravityBehavior);
    
    // Create and add new gravity behavior with random value
    gravityBehavior = new GravityBehavior(new Vec2D(0, randomGravity));
    physics.addBehavior(gravityBehavior);
    
    // Always set to true since we want to allow multiple clicks
    isStrongGravity = true;
  }
}