/*
	Hands for Girls, HTML5 Canvas Game
	Beta Version 1.0.2
	Copyright (c) 2013 Farias Maiquita (https://twitter.com/fariasmaiquita)
*/

window.onload = function () {

	// Get Document Elements
	
	var loadingSign = document.getElementById('loading'),
		canvasGirl = document.getElementById('canvas-girl'),
		avoidContainer = document.getElementById('avoid-container'),
		popupsContainer = document.getElementById('popups-container'),
		fadeoutBox = document.getElementById('fadeout-box'),
		soundtrack = document.getElementById('gameplay-soundtrack'),
		invitation = document.getElementById('invitation'),
		acceptBtn = document.getElementById('accept-btn'),
		notSureBtn = document.getElementById('not-sure-btn'),
		whyVideo = document.getElementById('why-video'),
		nowSureBtn = document.getElementById('now-sure-btn'),
		mainPanels = document.getElementById('main-panels'),
		panelLinks = document.getElementById('panel-links'),
		thePanels = document.getElementById('the-panels'),
		welcomeTagline = document.getElementById('welcome-tagline'),
		startBtn = document.getElementById('start-resume'),
		scoreText = document.getElementById('score'),
		challengeText = document.getElementById('challenge');
		
	// Check if browser supports canvas
	
	if (canvasGirl.getContext) {
		
		// Girl Variables Declaration & Initialization 
		var ctx = canvasGirl.getContext('2d'),
			myX, myY, myR, myI, myAngl, lastX, lastY,
			girlColor = "#000"
			easingDepth = 5,
			pi = Math.PI,
			girlEdges = new Array();
		
		// Trail Variables Declaration & Initialization
		var trailColor = 'rgba(237, 0, 140, 0.3)',
			tlhx, tlhy, trhx, trhy, tlfx, tlfy, trfx, trfy,
			trailHandLeft = new Array(),
			trailHandRight = new Array(),
			trailFootLeft = new Array(),
			trailFootRight = new Array();
		
		// Avoidance Particles Variables Declaration & Initialization
		var headX, headY, harmleftX, harmleftY, harmrightX, harmrightY,
			pDensity, pMinSpeed, pMaxSpeed,
			avoidParticles = new Array();
			
		// Points Pop-ups Variables Declaration & Initialization
		var pointsPopups = new Array(),
			totalScore = 0;
		
		// Menu Animations Variables Declaration & Initialization
		var animProgress = 1,
			showInvitation = false,
			showWhyVideo = false,
			showMainPanels = false,
			hideMainPanels = false,
			movingPanels = false,
			initPanelX, destPanelX, dispX;
			
		// Game Ending Sequence Variables Declaration & Initialization
		var gameTime, gameRunning, gamePaused, gameEnding, endingAlpha;
		
		// Gameplay Soundtrack Volume
		soundtrack.volume = 0.2;
		
		// Used to Request Animation Frame
		nextFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
		
		// Reset Main Values
		function resetValues() {
		
			myX = -30;
			myY = window.innerHeight/2;
			myR = 30;
			myI = 0;
			myAngl = 0;
			lastX = window.innerWidth/2;
			lastY = myY;
			
			trailHandLeft.length = 0;
			trailHandRight.length = 0;
			trailFootLeft.length = 0;
			trailFootRight.length = 0;
			avoidParticles.length = 0;
			pointsPopups.length = 0;
			
			pDensity = 0;
			pMinSpeed = 3;
			pMaxSpeed = 5;
			
			gameRunning = false;
			gamePaused = false;
			gameEnding = false;
			endingAlpha = 0;
			
		}
		
		
		// Fill browser width and height
		
		function resizeKeyElements() {
		
			if (window.innerWidth >= 800) {
			
				canvasGirl.width = window.innerWidth;
				avoidContainer.style.width = window.innerWidth + 'px';
				popupsContainer.style.width = window.innerWidth + 'px';
				fadeoutBox.style.width = window.innerWidth + 'px';
				
			} else {
			
				canvasGirl.width = 800;
				avoidContainer.style.width = '800px';
				popupsContainer.style.width = '800px';
				fadeoutBox.style.width = '800px';
				
			}
			if (window.innerHeight >= 500) {
			
				canvasGirl.height = window.innerHeight;
				avoidContainer.style.height = window.innerHeight + 'px';
				popupsContainer.style.height = window.innerHeight + 'px';
				fadeoutBox.style.height = window.innerHeight + 'px';
				
			} else {
			
				canvasGirl.height = 500;
				avoidContainer.style.height = '500px';
				popupsContainer.style.height = '500px';
				fadeoutBox.style.height = '500px';
				
			}
			
		}
		
		window.onresize = function() {
		
			resizeKeyElements();
			
			if (gamePaused) {
			
				drawGirl();
				drawAllTrails();
				
			}
			
		}
		
		
		// Draw the girl
		
		function drawGirl() {
			
			// Variables for Rotation
			var newX, newY;
			
			// Head
			
			ctx.beginPath();
			headX = (-myR*2)*Math.cos(myAngl) + myX + myR*2;
			headY = (-myR*2)*Math.sin(myAngl) + myY;
			girlEdges.push([headX + myR*7/6 + myR/5, headY], [headX, headY - myR*7/6 - myR/5], [headX, headY + myR*7/6 + myR/5]); // Register 3 Head Edges
			ctx.arc(headX, headY, myR, 0, 2*pi);
			ctx.fillStyle = girlColor;
			ctx.fill();
			
			// Hair
			
			var inithx = myX + myR*7/6,
				inithy = myY,
				hr = myR/5;
				angl = Math.PI/7;
			
			newX = (inithx - myX - myR*2)*Math.cos(myAngl) - (inithy - myY)*Math.sin(myAngl) + myX + myR*2;
			newY = (inithx - myX - myR*2)*Math.sin(myAngl) + (inithy - myY)*Math.cos(myAngl) + myY;
			ctx.beginPath();
			ctx.arc(newX, newY, hr, 0, 2*pi);
			ctx.fill();
			
			for (var i=1; i<=3; i++) {
			
				var lefthx = (inithx - myX)*Math.cos(angl*i) - (inithy - myY)*Math.sin(angl*i) + myX,
					lefthy = (inithx - myX)*Math.sin(angl*i) + (inithy - myY)*Math.cos(angl*i) + myY,
					righthx = (inithx - myX)*Math.cos(-angl*i) - (inithy - myY)*Math.sin(-angl*i) + myX,
					righthy = (inithx - myX)*Math.sin(-angl*i) + (inithy - myY)*Math.cos(-angl*i) + myY;
				
				newX = (lefthx - myX - myR*2)*Math.cos(myAngl) - (lefthy - myY)*Math.sin(myAngl) + myX + myR*2;
				newY = (lefthx - myX - myR*2)*Math.sin(myAngl) + (lefthy - myY)*Math.cos(myAngl) + myY;
				ctx.beginPath();
				ctx.arc(newX, newY, hr, 0, 2*pi);
				ctx.fill();
				
				newX = (righthx - myX - myR*2)*Math.cos(myAngl) - (righthy - myY)*Math.sin(myAngl) + myX + myR*2;
				newY = (righthx - myX - myR*2)*Math.sin(myAngl) + (righthy - myY)*Math.cos(myAngl) + myY;
				ctx.beginPath();
				ctx.arc(newX, newY, hr, 0, 2*pi);
				ctx.fill();
				
			}
			
			// Dress
			ctx.beginPath();
			newX = (myX-myR*5/4 - myX - myR*2)*Math.cos(myAngl) - (myY-myR*3/4 - myY)*Math.sin(myAngl) + myX + myR*2;
			newY = (myX-myR*5/4 - myX - myR*2)*Math.sin(myAngl) + (myY-myR*3/4 - myY)*Math.cos(myAngl) + myY;
			ctx.moveTo(newX, newY);
			newX = (myX-myR*5/4 - myX - myR*2)*Math.cos(myAngl) - (myY+myR*3/4 - myY)*Math.sin(myAngl) + myX + myR*2;
			newY = (myX-myR*5/4 - myX - myR*2)*Math.sin(myAngl) + (myY+myR*3/4 - myY)*Math.cos(myAngl) + myY;
			ctx.lineTo(newX, newY);
			newX = (myX-myR*5/4 - myR*3 - myX - myR*2)*Math.cos(myAngl) - (myY+myR*5/4 - myY)*Math.sin(myAngl) + myX + myR*2;
			newY = (myX-myR*5/4 - myR*3 - myX - myR*2)*Math.sin(myAngl) + (myY+myR*5/4 - myY)*Math.cos(myAngl) + myY;
			ctx.lineTo(newX, newY);
			newX = (myX-myR*5/4 - myR*3 - myX - myR*2)*Math.cos(myAngl) - (myY-myR*5/4 - myY)*Math.sin(myAngl) + myX + myR*2;
			newY = (myX-myR*5/4 - myR*3 - myX - myR*2)*Math.sin(myAngl) + (myY-myR*5/4 - myY)*Math.cos(myAngl) + myY;
			ctx.lineTo(newX, newY);
			ctx.fill();
			
			// Chest
			ctx.lineWidth = 2;
			ctx.lineCap = 'round';
			ctx.strokeStyle = '#fff';
			// Left Breast
			ctx.beginPath();
			newX = (myX-myR*5/4 - myR*3/4 - myX - myR*2)*Math.cos(myAngl) - (myY - myR*3/8 - myY)*Math.sin(myAngl) + myX + myR*2;
			newY = (myX-myR*5/4 - myR*3/4 - myX - myR*2)*Math.sin(myAngl) + (myY - myR*3/8 - myY)*Math.cos(myAngl) + myY;
			ctx.arc(newX, newY, myR*3/8, pi*3/4 + myAngl, pi*5/4 + myAngl);
			ctx.stroke();
			// Right Breast
			ctx.beginPath();
			newX = (myX-myR*5/4 - myR*3/4 - myX - myR*2)*Math.cos(myAngl) - (myY + myR*3/8 - myY)*Math.sin(myAngl) + myX + myR*2;
			newY = (myX-myR*5/4 - myR*3/4 - myX - myR*2)*Math.sin(myAngl) + (myY + myR*3/8 - myY)*Math.cos(myAngl) + myY;
			ctx.arc(newX, newY, myR*3/8, pi*3/4 + myAngl, pi*5/4 + myAngl);
			ctx.stroke();
			
			// Left Harm
			var hangl = Math.sin(myI)*pi/8,
				o_lhx = myX-myR*5/4 - myR*9/32,
				o_lhy = myY-myR*3/4,
				lhx = myX-myR*5/4 - myR*3/2 - myR*9/32,
				lhy = myY-myR*3/4 - myR*3/2,
				new_lhx = (lhx - o_lhx)*Math.cos(hangl) - (lhy - o_lhy)*Math.sin(hangl) + o_lhx,
				new_lhy = (lhx - o_lhx)*Math.sin(hangl) + (lhy - o_lhy)*Math.cos(hangl) + o_lhy;
			
			ctx.lineWidth = myR*9/16;
			ctx.strokeStyle = '#000';
			ctx.beginPath();
			harmleftX = (o_lhx - myX - myR*2)*Math.cos(myAngl) - (o_lhy - myY)*Math.sin(myAngl) + myX + myR*2;
			harmleftY = (o_lhx - myX - myR*2)*Math.sin(myAngl) + (o_lhy - myY)*Math.cos(myAngl) + myY;
			ctx.moveTo(harmleftX, harmleftY);
			tlhx = (new_lhx - myX - myR*2)*Math.cos(myAngl) - (new_lhy - myY)*Math.sin(myAngl) + myX + myR*2;
			tlhy = (new_lhx - myX - myR*2)*Math.sin(myAngl) + (new_lhy - myY)*Math.cos(myAngl) + myY;
			girlEdges.push([tlhx, tlhy - myR*9/8]); // Register Left Harm Edge
			ctx.lineTo(tlhx, tlhy);
			ctx.strokeStyle = girlColor;
			ctx.stroke();
			
			// Right Harm
			hangl *= -1;
			var o_rhx = myX-myR*5/4 - myR*9/32,
				o_rhy = myY+myR*3/4,
				rhx = myX-myR*5/4 - myR*3/2 - myR*9/32,
				rhy = myY+myR*3/4 + myR*3/2,
				new_rhx = (rhx - o_rhx)*Math.cos(hangl) - (rhy - o_rhy)*Math.sin(hangl) + o_rhx,
				new_rhy = (rhx - o_rhx)*Math.sin(hangl) + (rhy - o_rhy)*Math.cos(hangl) + o_rhy;
				
			ctx.beginPath();
			harmrightX = (o_rhx - myX - myR*2)*Math.cos(myAngl) - (o_rhy - myY)*Math.sin(myAngl) + myX + myR*2;
			harmrightY = (o_rhx - myX - myR*2)*Math.sin(myAngl) + (o_rhy - myY)*Math.cos(myAngl) + myY;
			ctx.moveTo(harmrightX, harmrightY);
			trhx = (new_rhx - myX - myR*2)*Math.cos(myAngl) - (new_rhy - myY)*Math.sin(myAngl) + myX + myR*2;
			trhy = (new_rhx - myX - myR*2)*Math.sin(myAngl) + (new_rhy - myY)*Math.cos(myAngl) + myY;
			girlEdges.push([trhx, trhy + myR*9/8]); // Register Right Harm Edge
			ctx.lineTo(trhx, trhy);
			ctx.stroke();
			
			// Left Leg
			var langl = ((Math.sin(myI) + 1)/2)*pi/16,
				o_llx = myX-myR*5/4 - myR*3 + 5,
				o_lly = myY-myR*3/4 + myR*9/32,
				llx = myX-myR*5/4 - myR*3 - myR*9/4,
				lly = myY-myR*3/4 + myR*9/32,
				new_llx = (llx - o_llx)*Math.cos(langl) - (lly - o_lly)*Math.sin(langl) + o_llx,
				new_lly = (llx - o_llx)*Math.sin(langl) + (lly - o_lly)*Math.cos(langl) + o_lly;
				
			ctx.beginPath();
			ctx.lineCap = 'butt';
			tlfx = (new_llx - myX - myR*2)*Math.cos(myAngl) - (new_lly - myY)*Math.sin(myAngl) + myX + myR*2;
			tlfy = (new_llx - myX - myR*2)*Math.sin(myAngl) + (new_lly - myY)*Math.cos(myAngl) + myY;
			girlEdges.push([tlfx, tlfy - myR*9/8]); // Register Left Leg Edge
			ctx.moveTo(tlfx, tlfy);
			newX = (o_llx - myX - myR*2)*Math.cos(myAngl) - (o_lly - myY)*Math.sin(myAngl) + myX + myR*2;
			newY = (o_llx - myX - myR*2)*Math.sin(myAngl) + (o_lly - myY)*Math.cos(myAngl) + myY;
			ctx.lineTo(newX, newY);
			ctx.stroke();
			
			// Right Leg
			langl *= -1;
			var o_rlx = myX-myR*5/4 - myR*3 + 5,
				o_rly = myY+myR*3/4 - myR*9/32,
				rlx = myX-myR*5/4 - myR*3 - myR*9/4,
				rly = myY+myR*3/4 - myR*9/32,
				new_rlx = (rlx - o_rlx)*Math.cos(langl) - (rly - o_rly)*Math.sin(langl) + o_rlx,
				new_rly = (rlx - o_rlx)*Math.sin(langl) + (rly - o_rly)*Math.cos(langl) + o_rly;
				
			ctx.beginPath();
			trfx = (new_rlx - myX - myR*2)*Math.cos(myAngl) - (new_rly - myY)*Math.sin(myAngl) + myX + myR*2;
			trfy = (new_rlx - myX - myR*2)*Math.sin(myAngl) + (new_rly - myY)*Math.cos(myAngl) + myY;
			girlEdges.push([trfx, trfy + myR*9/8]); // Register Right Leg Edge
			ctx.moveTo(trfx, trfy);
			newX = (o_rlx - myX - myR*2)*Math.cos(myAngl) - (o_rly - myY)*Math.sin(myAngl) + myX + myR*2;
			newY = (o_rlx - myX - myR*2)*Math.sin(myAngl) + (o_rly - myY)*Math.cos(myAngl) + myY;
			ctx.lineTo(newX, newY);
			ctx.stroke();
		
		}
		
		
		// Draw Trail
		
		function drawTrail(tnewx, tnewy, tpoints, tcolor) {
			
			// Draw the line
			if (tpoints.length > 0) {
				
				ctx.beginPath();
				ctx.strokeStyle = tcolor;
				ctx.lineWidth = myR*9/8;
				ctx.lineCap = 'round';
				ctx.lineJoin = 'round';
				for (var i=0; i<tpoints.length; i++) {
					if (i==0) {
						ctx.moveTo(tpoints[0][0], tpoints[0][1]);
					} else {
						ctx.lineTo(tpoints[i][0], tpoints[i][1]);
					}
				}
				ctx.lineTo(tnewx, tnewy);
				ctx.stroke();
			}
			
			// Register new points
			tpoints.push([tnewx, tnewy]);
			
		}
		
		function drawAllTrails() {
		
			drawTrail(tlhx, tlhy, trailHandLeft, trailColor);
			drawTrail(trhx, trhy, trailHandRight, trailColor);
			drawTrail(tlfx, tlfy, trailFootLeft, trailColor);
			drawTrail(trfx, trfy, trailFootRight, trailColor);
			
		}
		
		
		// Canvas Clear
		
		function clearcanvasGirl() {
		
			var mostx = 0,
				leasty, mosty,
				trails = [trailHandLeft, trailHandRight, trailFootLeft, trailFootRight];
			
			// Check Girl Edges
			for (var i=0; i<girlEdges.length; i++) {
				if (girlEdges[i][0] > -17*myR/2 && girlEdges[i][1] > -17*myR/2) {
					if (mostx < girlEdges[i][0]) mostx = girlEdges[i][0];
					if (leasty > girlEdges[i][1] || !leasty) leasty = girlEdges[i][1];
					if (mosty < girlEdges[i][1] || !mosty) mosty = girlEdges[i][1];
				}
			}
			girlEdges.length = 0; // Reset Girl Edges for Future Clear Canvas
			
			// Check Trail Edges
			for (var j=0; j<4; j++) {
				for (var k=0; k<trails[j].length; k++) {
					if (mostx < trails[j][k][0] + myR*9/8 + 30) mostx = trails[j][k][0] + myR*9/8 + 30;
					if (leasty > trails[j][k][1] - myR*9/8) leasty = trails[j][k][1] - myR*9/8;
					if (mosty < trails[j][k][1] + myR*9/8) mosty = trails[j][k][1] + myR*9/8;
				}
			}
			
			// Clear if necessary
			if (mostx > 0) {
				ctx.clearRect(0, leasty - 5, mostx + 5, mosty-leasty + 10);
			}
			
			// Prepare Trail for New Frame
			for (var j=0; j<4; j++) {
			
				// Decrement registered X values
				for (var k=0; k<trails[j].length; k++) {
					trails[j][k][0]-=30;
				}
				
				// Remove Off Canvas Points
				if (trails[j].length > 1 && trails[j][0][0] < -150) {
					var l=1;
					while (trails[j].length > l && trails[j][l][0] < -150) {
						trails[j].shift();
						l++;
					}
				}
				
			}
			
		}
		
		
		// Update Avoidance Particles
		
		function updateAvoidanceParticles() {
			
			for (var i=0; i<avoidParticles.length; i++) {
			
				// Move Particles to the Left
				avoidParticles[i][0] -= avoidParticles[i][4];
				
				// Generate New Particle if Current Particle is Off Canvas
				if (avoidParticles[i][0] + avoidParticles[i][2] < 0) {
					
					// If Particle Has Been Avoided and Girl isn't Off Canvas, Register Score
					if (avoidParticles[i][6] && tlhx > 0 && tlhy > 0 && trhx > 0 && trhy < canvasGirl.height && tlfx > 0 && tlfy > 0 && trfx > 0 && trfy < canvasGirl.height) {
						hitScore = Math.round(10 + 80*(avoidParticles[i][4] - avoidParticles[i][7])/(avoidParticles[i][8] - avoidParticles[i][7]));
						totalScore += hitScore;
					}
					
					if (avoidParticles.length > pDensity && i == avoidParticles.length-1) {
						
						avoidParticles.pop();
						var particle = document.getElementById('avoid-' + i);
						avoidContainer.removeChild(particle);
						
					} else {
					
						avoidParticles[i][8] = pMaxSpeed;
						avoidParticles[i][7] = pMinSpeed;
						avoidParticles[i][6] = true;
						avoidParticles[i][5] = true;
						avoidParticles[i][4] = randomBetween(pMinSpeed, pMaxSpeed);
						avoidParticles[i][3] = randomBetween(60, 100) / 100;
						avoidParticles[i][2] = randomBetween(15, 20);
						avoidParticles[i][1] = randomBetween(50, canvasGirl.height - 50);
						avoidParticles[i][0] = canvasGirl.width + avoidParticles[i][2];
						
					}
					
				}
				
			}
			
			// Randomly Add New Particle
			if (randomBetween(0, 100) > 95 && avoidParticles.length < pDensity) {
			
				var pID = avoidParticles.length,
					pSpeed = randomBetween(pMinSpeed, pMaxSpeed),
					pAlpha = randomBetween(60, 100) / 100,
					pRadius = randomBetween(15, 20),
					pY = randomBetween(50, canvasGirl.height - 50),
					pX = canvasGirl.width + pRadius;
					
				avoidParticles.push([pX, pY, pRadius, pAlpha, pSpeed, true, true, pMinSpeed, pMaxSpeed]); // 1st Boolean is "Active", 2nd Boolean is "Avoided"
				createDomCircle(pX, pY, pRadius, pAlpha, 'avoid-' + pID, 'avoid', avoidContainer);
				
			}
			
			// Update Position of All Active Particles
			for (var i=0; i < avoidParticles.length; i++) {
				
				if (avoidParticles[i][5]) {
				
					var particle = document.getElementById('avoid-' + i);
					updateDomCircle(avoidParticles[i][0], avoidParticles[i][1], avoidParticles[i][2], avoidParticles[i][3], particle);
					
				}
			}
			
		}
		
		// Generate a Random Number from a Given Interval
		function randomBetween(m, n) {
			return Math.floor((Math.random()*(n-m+1))+m);
		}
		
		// Create a Circle DIV element in the DOM
		function createDomCircle(cx, cy, cr, copacity, cid, cclass, ccontainer) {
			
			var newCircle = document.createElement('div');
			
			newCircle.style.left = cx + 'px';
			newCircle.style.top = cy + 'px';
			newCircle.style.width = 2*cr + 'px';
			newCircle.style.height = 2*cr + 'px';
			newCircle.style.marginLeft = -cr + 'px';
			newCircle.style.marginTop = -cr + 'px';
			newCircle.style.opacity = copacity;
			
			newCircle.id = cid;
			newCircle.className = 'circle ' + cclass;
			ccontainer.appendChild(newCircle);
			
		}
		
		// Update a Circle DIV element in the DOM
		function updateDomCircle(cx, cy, cr, copacity, theCircle) {
			
			theCircle.style.left = cx + 'px';
			theCircle.style.top = cy + 'px';
			theCircle.style.width = 2*cr + 'px';
			theCircle.style.height = 2*cr + 'px';
			theCircle.style.marginLeft = -cr + 'px';
			theCircle.style.marginTop = -cr + 'px';
			theCircle.style.opacity = copacity;
			
		}
		
		
		// Verify Collisions
		
		function verifyCollisions() {
			
			var trails = [trailHandLeft, trailHandRight, trailFootLeft, trailFootRight],
				hitScore;
			
			for (var i=0; i<avoidParticles.length; i++) {
			
				if (avoidParticles[i][5]) {
					
					// Collision with Trails
					
					if (avoidParticles[i][0] <= tlhx + myR*9/32 || avoidParticles[i][0] <= trhx + myR*9/32) {
					
						for (var j=0; j<4; j++) {
							for (var k=0; k<trails[j].length; k++) {	
								if (trails[j][k][0] > 0 && Math.abs(trails[j][k][0] - avoidParticles[i][0]) < myR*2 && Math.abs(trails[j][k][1] - avoidParticles[i][1]) < myR*2) {
								
									if (circlesTouch(avoidParticles[i][0], avoidParticles[i][1], avoidParticles[i][2], trails[j][k][0], trails[j][k][1], myR*9/16) ||
										(k > 0 && circleAndLineTouch(avoidParticles[i][0], avoidParticles[i][1], avoidParticles[i][2] + myR*9/32, trails[j][k-1][0], trails[j][k-1][1], trails[j][k][0], trails[j][k][1]))) {
										
										avoidParticles[i][5] = false;
										var particle = document.getElementById('avoid-' + i);
										particle.style.opacity = 0;
										
										hitScore = Math.round(10 + 80*(avoidParticles[i][4] - avoidParticles[i][7])/(avoidParticles[i][8] - avoidParticles[i][7]));
										totalScore += hitScore;
										addPointsPopup(avoidParticles[i][0], avoidParticles[i][1], hitScore);
										
									}
									
								}
							}
						}
						
					}
					
					// Collision with Head and Harms
					
					if (avoidParticles[i][0] < headX + 2*myR && (avoidParticles[i][0] >= tlhx + myR*9/32 || avoidParticles[i][0] >= trhx + myR*9/32)) {
					
						if (circlesTouch(avoidParticles[i][0], avoidParticles[i][1], avoidParticles[i][2], headX, headY, myR*7/6 + myR/5) ||
							circleAndLineTouch(avoidParticles[i][0], avoidParticles[i][1], avoidParticles[i][2] + myR*9/32, harmleftX, harmleftY, tlhx, tlhy) ||
							circleAndLineTouch(avoidParticles[i][0], avoidParticles[i][1], avoidParticles[i][2] + myR*9/32, harmrightX, harmrightY, trhx, trhy) ) {
							
							avoidParticles[i][6] = false;
							avoidParticles[i][5] = false;
							var particle = document.getElementById('avoid-' + i);
							particle.style.opacity = 0;
							
							hitScore = -1*Math.round(10 + 80*(avoidParticles[i][4] - avoidParticles[i][7])/(avoidParticles[i][8] - avoidParticles[i][7]));
							totalScore += hitScore;
							addPointsPopup(avoidParticles[i][0], avoidParticles[i][1], hitScore);
							
						}
					
					}
				}
			}
		}
		
		// Collision Between Circles
		
		function circlesTouch(x1, y1, r1, x2, y2, r2) {
			return (Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2)) <= (r1 + r2));
		}
		
		// Collision Between a Circle & a Line
		
		function circleAndLineTouch(cx, cy, cr, x1, y1, x2, y2) {
			
			var vA, vB, vC, vD;
			
			if (x1 == x2) {
			
				vA = 1;
				vB = -2*cy;
				vC = cy*cy + (x1 - cx)*(x1 - cx) -cr*cr;
				vD = vB*vB - 4*vA*vC;
				
				if (vD < 0) return false;
				
				var vY1 = (-vB + Math.sqrt(vD))/(2*vA),
					vY2 = (-vB - Math.sqrt(vD))/(2*vA);
				
				return ((y1 >= vY1 && vY1 >= y2) || (y1 <= vY1 && vY1 <= y2) || (y1 >= vY2 && vY2 >= y2) || (y1 <= vY2 && vY2 <= y2));
				
			} else {
			
				var m = (y1 - y2)/(x1 - x2),
					c = y1 - m*x1;
				
				vA = m*m + 1;
				vB = 2*(m*c - m*cy - cx);
				vC = cy*cy - cr*cr + cx*cx - 2*c*cy + c*c;
				vD = vB*vB - 4*vA*vC;
				
				if (vD < 0) return false;
				
				var vX1 = (-vB + Math.sqrt(vD))/(2*vA),
					vX2 = (-vB - Math.sqrt(vD))/(2*vA);
				
				return ((x1 >= vX1 && vX1 >= x2) || (x1 <= vX1 && vX1 <= x2) || (x1 >= vX2 && vX2 >= x2) || (x1 <= vX2 && vX2 <= x2));
				
			}
			
		}
		
		
		// Update Points Pop-ups
		
		function updatePointsPopups() {
			
			// Remove Transparent Pop-ups
			
			var j = 0;
			while (j < pointsPopups.length && pointsPopups[j][3] <= 0) {
				pointsPopups.shift();
				popupsContainer.removeChild(popupsContainer.childNodes[0]);
				j++;
			}
			
			// Update Existing Points
			
			for (var i=0; i<pointsPopups.length; i++) {
			
				popupsContainer.childNodes[i].style.opacity = pointsPopups[i][3];
				popupsContainer.childNodes[i].style.top = pointsPopups[i][1] + 'px';
				
				pointsPopups[i][3] -= 0.025;
				pointsPopups[i][1] --;
				
			}
			
		}
		
		function addPointsPopup(px, py, pscore) {
			
			pointsPopups.push([px, py, pscore, 1]);
			
			var newPopup = document.createElement('div');
			
			newPopup.style.left = px + 'px';
			newPopup.style.top = py + 'px';
			
			if (pscore >= 0) {
				newPopup.className = 'circle hitpoints plus';
				newPopup.innerHTML = '+' + pscore;
			} else {
				newPopup.className = 'circle hitpoints minus';
				newPopup.innerHTML = pscore;
			}
			
			popupsContainer.appendChild(newPopup);
			
		}
		
		
		// Draw All Elements Into New Frame
		
		function drawInGameFrame() {
		
			// Iterator for Harms and Legs Animation
			if (myI + pi/45 >= 2*pi) {
				myI = 0;
			} else {
				myI+=pi/45;
			}
			
			// Mouse Follow with Easing
			myX += ((lastX - ((Math.sin(myI) + 1)/2)*myR*3 - myR*2) - myX)/easingDepth;
			myY += (lastY - myY)/easingDepth;
			
			// Determine Angle of Inclination for Girl on Mouse Follow
			myAngl += ((lastY - myY)*(pi/5)/(myR*17/4) - myAngl)/6;
			
			// Clear and Redraw Canvas 1 - Girl and Trail
			clearcanvasGirl();
			drawGirl();
			drawAllTrails();
			
			// Adjust Level of difficulty
			gameTime = Math.floor(soundtrack.currentTime);
			if (gameTime >= 6 && gameTime <= 8) {
				pDensity = 1;
			} else if (gameTime >= 11 && gameTime <= 13) {
				pDensity = 2;
				pMinSpeed = 6;
				pMaxSpeed = 10;
			} else if (gameTime >= 16 && gameTime <= 18) {
				pDensity = 3;
			} else if (gameTime >= 91 && gameTime <= 93) {
				pDensity = 4;
			} else if (gameTime >= 173 && gameTime <= 175) {
				pDensity = 5;
				pMinSpeed = 11;
				pMaxSpeed = 15;
			} else if (gameTime >= 214 && gameTime <= 216) {
				pDensity = 4;
				pMinSpeed = 6;
				pMaxSpeed = 10;
			} else if (gameTime >= 217 && gameTime <= 219) {
				pDensity = 3;
			} else if (gameTime >= 220 && gameTime <= 222) {
				pDensity = 2;
			} else if (gameTime >= 223 && gameTime <= 225) {
				pDensity = 1;
				pMinSpeed = 3;
				pMaxSpeed = 5;
			} else if (gameTime >= 226 && gameTime <= 228) {
				pDensity = 0;
			}
			
			// Update Avoidance Particles
			updateAvoidanceParticles();
			verifyCollisions();
			
			// Update Points Pop-ups
			updatePointsPopups();
			
			// Game Ending Sequence
			
			if (gameEnding) {
			
				fadeoutBox.style.opacity = endingAlpha;
				
				if (endingAlpha >= 1) {
				
					// Clear ALl Canvas
					ctx.clearRect(0, 0, canvasGirl.width, canvasGirl.height);
					
					// Reset Main Values
					resetValues();
					popupsContainer.removeEventListener('mousemove', listenToMouseMove);
					fadeoutBox.style.zIndex = '0';
					
					// Update Main Panels Messages
					welcomeTagline.innerHTML = 'Thanks for playing! Share this with everyone you know, and play it as many times as possible. The rules:';
					startBtn.innerHTML = 'Start New Game';
					
					if (totalScore > 0) {
					
						scoreText.innerHTML = 'Your Score: ' + totalScore + '<br><br>World change is how you roll!';
						if (totalScore > 35000) {
							challengeText.innerHTML = 'But in the meantime congratulations on achieving such a challeging score.';
						} else {
							challengeText.innerHTML = 'But in the meantime I challenge you to score higher than 35000.';
						}
						
					} else {
						scoreText.innerHTML = 'Your Score: ' + totalScore + '<br><br>Maybe you should give it another try!';
					}
					
					deactivateAllTabPanels();
					panelLinks.children[1].className = 'active';
					thePanels.style.left = '-480px';
					
					// Show Main Panels
					
					animProgress = 2;
					showMainPanels = true;
					
					if(nextFrame) {
						nextFrame(panelsFrame);
					} else {
						setInterval(updatePanelsFrame, 1E3/60);
					}
					
				} else {
					endingAlpha += 0.04;
				}
				
			}
			
		}
		
		// Draw and Call New In-game Animation Frame
		function inGameFrame(e) {
			drawInGameFrame();
			if (gameRunning) nextFrame(inGameFrame);
		}
		
		// Listen to Mouse Move
		listenToMouseMove = function(e) {
			lastX = e.clientX;
			lastY = e.clientY;
		};
		
		// Start Game
		
		function startGame() {
			
			gameRunning = true;
			soundtrack.play();
			
			popupsContainer.addEventListener('mousemove', listenToMouseMove);
			
			if(nextFrame) {
				nextFrame(inGameFrame);
			} else {
				setInterval(drawInGameFrame, 1E3/60);
			}
			
		}
		
		
		// Show & Hide Panels
		
		function updatePanelsFrame() {
		
			var progress;
			
			animProgress = Math.round(animProgress*100)/100;
			
			if (animProgress > 2) {
				progress = Math.sqrt(2*(animProgress - 2) - (animProgress - 2)*(animProgress - 2));
			} else {
				progress = Math.sqrt(2*animProgress - animProgress*animProgress);
			}
			
			if (showInvitation) {
				
				// Show First Panel - invitation
				
				if (animProgress <= 2) {
					loadingSign.style.top = (progress*10 + 40) + '%';
					loadingSign.style.opacity = progress;
				} else {
					loadingSign.style.visibility = 'hidden';
					loadingSign.style.top = '-600px';
				}
				
				if (animProgress >= 2) {
					invitation.style.top = (progress*10 + 40) + '%';
					invitation.style.opacity = progress;
					invitation.style.visibility = 'visible';
				}
				
				if (animProgress >= 3) {
					
					showInvitation = false;
					animProgress = 1;
				} else {
					animProgress += 0.05;
				}
				
			} else if (showWhyVideo) {
				
				// Show Why Video
				
				if (animProgress <= 2) {
					invitation.style.top = (progress*10 + 40) + '%';
					invitation.style.opacity = progress;
				} else {
					invitation.style.visibility = 'hidden';
					invitation.style.top = '-600px';
				}
				
				if (animProgress >= 2) {
					whyVideo.style.top = (progress*10 + 40) + '%';
					whyVideo.style.opacity = progress;
					whyVideo.style.visibility = 'visible';
				}
				
				
				if (animProgress >= 3) {
					
					showWhyVideo = false;
					
					var newIframe = document.createElement('iframe');
					newIframe.width = '640';
					newIframe.height = '360';
					newIframe.src = 'http://www.youtube.com/embed/1e8xgF0JtVg?rel=0';
					newIframe.frameborder = '0';
					
					var videoContainer = document.getElementById('video-container');
					videoContainer.appendChild(newIframe);
					
					animProgress = 1;
					
				} else {
					animProgress += 0.05;
				}
				
			} else if (showMainPanels) {
				
				// Show Main Panels
				
				if (animProgress <= 2) {
					if (invitation.style.visibility != 'hidden') {
						invitation.style.top = (progress*10 + 40) + '%';
						invitation.style.opacity = progress;
					} else {
						whyVideo.style.top = (progress*10 + 40) + '%';
						whyVideo.style.opacity = progress;
					}
				} else {
					if (invitation.style.visibility != 'hidden') {
						invitation.style.visibility = 'hidden';
						invitation.style.top = '-600px';
					} else {
						whyVideo.style.visibility = 'hidden';
						whyVideo.style.top = '-600px';
					}
				}
				
				if (animProgress >= 2) {
					mainPanels.style.top = (progress*10 + 40) + '%';
					mainPanels.style.opacity = progress;
					mainPanels.style.visibility = 'visible';
				}
				
				if (animProgress >= 3) {
					showMainPanels = false;
					animProgress = 1;
				} else {
					animProgress += 0.05;
				}
				
				
			} else if (movingPanels) {
				
				// Move Tab Panels
				
				if (animProgress < 2) {
					thePanels.style.left = (initPanelX + (1 - progress)*dispX) + 'px';
				} else {
					thePanels.style.left = (initPanelX + dispX + progress*dispX) + 'px';
				}
				
				if (animProgress >= 3) {
					movingPanels = false;
					animProgress = 1;
				} else {
					animProgress += 0.05;
				}
				
			} else if (hideMainPanels) {
			
				// Hide Main Panels
				
				mainPanels.style.top = (progress*10 + 40) + '%';
				mainPanels.style.opacity = progress;
				
				if (animProgress >= 2) {
				
					mainPanels.style.visibility = 'hidden';
					mainPanels.style.top = '-600px';
					hideMainPanels = false;
					animProgress = 1;
					startGame();
					gameRunning = true;
					gamePaused = false;
					
				} else {
					animProgress += 0.05;
				}
				
			}
			
		}
		
		// De-active All Tab Panels
		function deactivateAllTabPanels() {
			for (var i=0; i<3; i++) {
				panelLinks.children[i].className = '';
			}
		}
		
		function panelsFrame(e) {
			updatePanelsFrame();
			if (showInvitation || showWhyVideo || movingPanels || showMainPanels || hideMainPanels) {
				nextFrame(panelsFrame);
			}
		}
		
		// Show Panels After Pre-loading
		function showPanels() {
			
			// Game Ended
			soundtrack.addEventListener('ended', function() {
			
				gameEnding = true;
				fadeoutBox.style.zIndex = '4';
				
			});
			
			// Pause Game
			document.addEventListener('keypress', function(e) {
			
				if (gameRunning && e.keyCode === 13 && !gameEnding) {
					
					welcomeTagline.innerHTML = "Your game has been paused. Here's a quick recap of what you need to do:";
					startBtn.innerHTML = 'Resume Game';
					scoreText.innerHTML = 'Your Current Score: ' + totalScore;
					
					if (totalScore > 35000) {
						challengeText.innerHTML = 'But in the meantime congratulations on achieving such a challeging score.';
					} else {
						challengeText.innerHTML = 'But in the meantime I challenge you to score higher than 35000.';
					}
					
					deactivateAllTabPanels();
					panelLinks.children[1].className = 'active';
					thePanels.style.left = '-480px';
					
					gameRunning = false;
					gamePaused = true;
					soundtrack.pause();
					popupsContainer.removeEventListener('mousemove', listenToMouseMove);
					
					animProgress = 2;
					showMainPanels = true;
					
					if(nextFrame) {
						nextFrame(panelsFrame);
					} else {
						setInterval(updatePanelsFrame, 1E3/60);
					}
					
				}
				
			});
			
			// Start or Resume Game
			startBtn.addEventListener('click', function() {
			
				if (!gamePaused) totalScore = 0;
				
				animProgress = 1;
				hideMainPanels = true;
				
				if(nextFrame) {
					nextFrame(panelsFrame);
				} else {
					setInterval(updatePanelsFrame, 1E3/60);
				}
			
			});
			
			// Tab Links
			for (var i=0; i<3; i++) {
			
				panelLinks.children[i].addEventListener('click', function() {
				
					deactivateAllTabPanels();
					this.className = 'active';
					initPanelX = parseInt(thePanels.style.left);
					
					if (this.id == 'instructions-link') destPanelX = 0;
					else if (this.id == 'highscores-link') destPanelX = -480;
					else if (this.id == 'about-link') destPanelX = -960;
					
					dispX = (destPanelX - initPanelX)/2;
					
					animProgress = 1;
					movingPanels = true;
					
					if(nextFrame) {
						nextFrame(panelsFrame);
					} else {
						setInterval(updatePanelsFrame, 1E3/60);
					}
					
				});
				
			}
			
			// Convinced Link
			nowSureBtn.addEventListener('click', function() {
				
				animProgress = 1;
				showMainPanels = true;
				
				if(nextFrame) {
					nextFrame(panelsFrame);
				} else {
					setInterval(updatePanelsFrame, 1E3/60);
				}
				
			});
			
			// Not Sure Link
			notSureBtn.addEventListener('click', function() {
			
				animProgress = 1;
				showWhyVideo = true;
				
				if(nextFrame) {
					nextFrame(panelsFrame);
				} else {
					setInterval(updatePanelsFrame, 1E3/60);
				}
				
			});
			
			// Accept Link
			acceptBtn.addEventListener('click', function() {
				
				animProgress = 1;
				showMainPanels = true;
				
				if(nextFrame) {
					nextFrame(panelsFrame);
				} else {
					setInterval(updatePanelsFrame, 1E3/60);
				}
				
			});
			
			// First Panel - Invitation
			showInvitation = true;
			if(nextFrame) {
				nextFrame(panelsFrame);
			} else {
				setInterval(updatePanelsFrame, 1E3/60);
			}
			
		}
		
		
		// Make Stuff Happen on Screen ^-^
		
		resizeKeyElements();
		resetValues();
		showPanels();
		
	}
	
};