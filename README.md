# Decentraland_ParkourKit

This module provides users an easy to use interface for creating and managing parkour stages. Using this module, you can:

	-create platforms, 4 types (static, pathed, rotating, and blinking)
	-create collectibles, 2 types (collision, interaction)
	-create checkpoints, act as respawn/default locations around your scene
	-create traps, 3 types (static, toggling, and projectile)
	-parent parkour objects with one another to create complex layouts
	-dynamically dis/enable individual objects that are part of sets during run-time

![firefox_srr356tgFU](https://user-images.githubusercontent.com/91359820/197311376-d3ce5d3c-7389-4ebb-b073-38a30e7d5ec2.png)

This module has been heavily documented and will work as-is/out of the box. You can get a quick overview of all the module's current features in-game [here](https://decentraland-parkour-kit.herokuapp.com/).

or by downloading the scene and running it locally (ensure you have the DCL SDK installed).

File Overview:

	game.ts: demo of on-start code
	
	utilities: bundled library for secondary/support features
	   collections.ts: lists and dicts
	   menu-group-2D.ts: easy management system for creating 2D HUD/menu
	   
	parkour-core: contains all primary module features
	   /config: contains data that defines placement for objects around the scene (if new, start here!)
	   /data: contains data that defines styles and object defaults that will be used by the system
	   parkour-manager: manages all parkour objects within the scene and handles set enable/disable requests
	   parkour-<object>: each object contains their own functionality file (ie: platform/trap), where you can view their functions/systems

You can find more information regarding mechanics inside each of these files.

TODO LIST:

	pending... (but more testing is always good ^_^)

IDEAS LIST:

	implement an addition that allows the user to create set-changing triggers easily, each with their own bound set and objects.

BUG LIST:

	systems in-scene can stall-out if certain conditions are met when interacting with browser (grabbing/resizing window when out of focus, but not 100% reproducable); this appears to be a framework-sided issue and not something that can currently be fixed through the module.

If you run into any issues, send me an e-mail at: 
  thecryptotrader69@gmail.com
