# Decentraland_ParkourKit

This module provides users an easy to use interface for creating and managing parkour stages. You can define platforms of four given types (static, pathed, rotating, and blinking), define an in-stage parent, and dynamically dis/enable individual sets in an active scene.

This module has been heavily documented and will work as-is/out of the box. You can try it out here:

https://decentraland-parkour-kit.herokuapp.com/

or by downloading the scene and running it locally (ensure you have the DCL SDK installed).

File Overview:

	-game.ts: demo of on-start code
	-utilities: bundled library for lists and dicts
	-parkour-manager: manages platforms and modifies the current set of active platforms in the scene
	-parkour-platforms: objects used to define platforms and their systems
	-platform-style-data: data definitions for platform styles that can be displayed in scene
	-platform-object-data: data definitions for platforms to be displayed in the scene (generated on-load)

You can find more information regarding mechanics inside each of these files.

If you run into any issues, send me an e-mail at: 
  thecryptotrader69@gmail.com