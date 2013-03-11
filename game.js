/* Some Super global variables */

var current_level = 1
var max_levels = 2

/*
	This is our main game 'Object'. In Javascript, functions can be used
	to define lots of other pieces of a program. Our game has a few 'global'
	variables and 3 functions: setup, update and draw. Each of these have
	a special job to do. We'll find out more about them each session.
*/
function Game()
{
	/* Some variables to store useful stuff in */
	var fps
	
	var ship
	var background = {}
	
	var monster

	var viewport

	/* Called once when a game is first run. Use it for one-time setup code. */
	this.setup = function()
	{
		fps = document.getElementById("fps")
		
		// load background in here
		var level = "graphics/background-level-"+current_level+".png"
		
		if (current_level < max_levels)
		{
			jaws.assets.load("graphics/background-level-"+ (current_level+1) +".png")
		}
		
		background.sprite = new jaws.Sprite({image: level, x:0, y:0})
		background.canvas = background.sprite.asCanvas()
		background.rawData = background.canvas.getContext("2d").getImageData(0, 0, background.sprite.width, background.sprite.height).data
		
		background.checkCollision = function(x, y)
		{
			x = Math.floor(x)
  			y = Math.floor(y)
  			// check the alpha - returns TRUE only if fully opaque
  			try { return this.rawData[( (y-1) * this.sprite.width * 4) + (x*4) + 3] == 255  }
  			catch(e) { return false }
		}
		
		//get the width and height of the background
		var width = background.sprite.width
		var height = background.sprite.height

		//setup viewport and scroll it to the bottom
		viewport = new jaws.Viewport({max_x: width, max_y: height, x: 0, y: height})


		/********************
		** Create a ship **
		********************/
		var ships_sheet = new jaws.SpriteSheet({image: "graphics/ship.png", frame_size: [64,64], orientation: "right"})
		ship = new jaws.Sprite({image: ships_sheet.frames[0], x:500, y:height-64, anchor: "center"})
		
		/* Move the ship around */
		//Ship movement variables
		ship.vx = 0 // velocity x (left & right)
		ship.vy = 0 // velocity y (up and down)
		
		ship.move = function() 
		{
			//move left or right.
			this.x += this.vx

			//Move up or down.
			this.y += this.vy
			
			//Check to see if we hit anything.
			var farLeft = this.x-32
			var farRight = this.x+32
			if(background.checkCollision(farLeft, this.y) || background.checkCollision(farRight, this.y) || jaws.collideOneWithOne(this, monster)) 
			{ 	
				//We hit something, so undo moving up or down.
				jaws.switchGameState(CrashScreen)
			}
			
			//stop moving left or right
			this.vx = 0
			
			//stop moving up or down
			this.vy = 0
		}
		
		
		/* Shoot stuff! */
		ship.bullets = new jaws.SpriteList()
		ship.fire_rate = 18 //How fast can the ship fire?
		ship.can_shoot = true
		ship.shoot_timer = 0
		
		ship.shoot = function()
		{
			if (this.can_shoot)
			{
				this.can_shoot = false
				this.shoot_timer = this.fire_rate
				
				var bullet = new jaws.Sprite({image: "graphics/bullet.png", x:this.x, y:this.y-32, anchor: "center"})
				bullet.update = function()
				{
					this.y -= 15 //move the bullet upwards!
					
					if (viewport.isOutside(this) || background.checkCollision(this.x, this.y))
					{
						ship.bullets.remove(this)
					}
					
					//look to see if we hit the monster!
					if (jaws.collideOneWithOne(this, monster))
					{
						monster.hit_points -= 2
						ship.bullets.remove(this)
					}
					
				}
				ship.bullets.push(bullet)
			}
			
		}
		
		
		/* Update ship statuses */
		ship.update = function()
		{	
			if (this.shoot_timer == 0)
			{
				this.can_shoot = true
			}
			else
			{
				this.shoot_timer -= 1
			}
			
			this.bullets.update()
		}

		// Load the ship animation sheet
		/*var anim = new jaws.Animation({sprite_sheet: "graphics/ship.png", 
									   frame_size: [64,64], 
									   orientation: "right", 
									   frame_duration: 100 })
		//Set up some animations
		ship.anim_default = anim.slice(0,3)
		ship.anim_right = ship.anim_default //anim.slice(4,7)
		ship.anim_left = ship.anim_default //anim.slice(8,11)
		
		//Set the player's starting graphic
		ship.setImage( ship.anim_default.next() )*/
		
		
		monster = new jaws.Sprite({image: "graphics/monster-level-1.png", x:400, y:60, anchor: "center"})
		
		monster.hit_points = 20
		
		monster.vy = 0
		monster.vx = 3
		
		monster.bullets = new jaws.SpriteList()
		
		monster.move = function()
		{
			//move left or right.
			this.x += this.vx

			//Move up or down.
			this.y += this.vy
			
			//Check to see if we hit anything.
			var farLeft = this.x-64
			var farRight = this.x+64
			if(background.checkCollision(farLeft, this.y) || background.checkCollision(farRight, this.y)) 
			{ 	
				this.vx = -this.vx // if we hit the side, go the other way instead!
			}
		}
		
		monster.shoot = function()
		{
			/****************
			** Need to put **
			** shoot code  **
			** in here     **
			****************/	
		}
		
		monster.update = function()
		{
			//Monster AI goes in here!!
			this.shoot()
			this.move()
		}
		
		
		
		
		/* Ignore this stuff */
		jaws.context.mozImageSmoothingEnabled = false;  // non-blurry, blocky retro scaling
		jaws.preventDefaultKeys(["up", "down", "left", "right", "space"]) //stop keys scrolling page
	}
	

    /* update() will get called each game tick (FPS). Put game logic here. */
	this.update = function() 
	{
		//reset player to 'default'
		//ship.setImage( player.anim_default.next() )

		//set the player's left-right velocity to zero
		ship.vx = 0
		
		//Check to see what keys have been pressed
		if(jaws.pressed("left"))  { ship.vx = -5; /*ship.setImage(ship.anim_left.next())*/ }
		if(jaws.pressed("right")) { ship.vx = 5;  /*ship.setImage(ship.anim_right.next())*/ }
		
		if(jaws.pressed("up"))    { ship.vy = -7 }
		if(jaws.pressed("down"))    { ship.vy = +3 }
		
		/******************
		** Add code here **
		**   to shoot    **
		******************/
		
		

		//Scroll the viewport upwards and make sure the ship stays visible!
		viewport.move(0, -2)
		// Check to see if we got to the end!
		if (viewport.y > 0)
		{
			// Still moving, keep the ship moving forward
			ship.vy -= 2
		}
		
		// apply vx / vy (x velocity / y velocity), check for collision detection in the process.
		ship.move()
		ship.update()
		
		monster.update()
		
		
		if (monster.hit_points <= 0)
		{
			jaws.switchGameState(WinScreen)
		}
		
		//Make sure the ship doesn't get left behind.
		viewport.forceInsideVisibleArea(ship, 32)
				
		
		/*************************
		** Update Monsters Here **
		**                      **
		**  We'll look at this  **
		**  in a later session  **
		*************************/
		
		
		

		//update the FPS box.
		fps.innerHTML = jaws.game_loop.fps
	}


	/* Directly after each update draw() will be called. Put all your on-screen operations here. */
	this.draw = function()
	{
		//clear the screen
		jaws.clear()
		
		//draw what we can see through the viewport
		viewport.apply(
			function()
			{
				jaws.context.drawImage(background.canvas, 0, 0)
				ship.draw()
				ship.bullets.draw()
				monster.draw()
				monster.bullets.draw()
			}
		)
	}
}






/* This is a new Game State that lets us display a message on the screen */
function CrashScreen()
{
	this.setup = function()
	{
		this.counter = 600
	}
	
	this.update = function()
	{
		this.counter -= 1
		
		if (this.counter == 0)
		{
			jaws.switchGameState(Game)	
		}
	}
	
	this.draw = function()
	{
		jaws.clear()
		
		jaws.context.save()
      	jaws.context.fillStyle  = "black"
      	jaws.context.fillRect(0, 0, jaws.width, jaws.height);
      	jaws.context.textAlign  = "center"
      	jaws.context.fillStyle  = "white"
      	jaws.context.font       = "bold 20px terminal";
      	jaws.context.fillText("You Crashed!", jaws.width/2, jaws.height/2);
		jaws.context.fillText("Restarting in "+ Math.floor(this.counter / 60), jaws.width/2, jaws.height/2+20);
      	jaws.context.restore()
	}
}


function WinScreen()
{
	this.setup = function()
	{
		this.counter = 600
	}
	
	this.update = function()
	{
		this.counter -= 1
		
		if (this.counter == 0)
		{
			current_level += 1
			if (current_level > max_levels) { current_level = 1 }
			jaws.switchGameState(Game)	
		}
	}
	
	this.draw = function()
	{
		jaws.clear()
		
		jaws.context.save()
      	jaws.context.fillStyle  = "black"
      	jaws.context.fillRect(0, 0, jaws.width, jaws.height);
      	jaws.context.textAlign  = "center"
      	jaws.context.fillStyle  = "white"
      	jaws.context.font       = "bold 20px terminal";
      	jaws.context.fillText("Congratulations! You made it to the end.", jaws.width/2, jaws.height/2);
		jaws.context.fillText("Next level in "+ Math.floor(this.counter / 60), jaws.width/2, jaws.height/2+20);
      	jaws.context.restore()
	}
}


