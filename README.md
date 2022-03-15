# Decentraland_ParkourKit

This module provides users an easy to use interface for creating and managing parkour stages. You can define platforms of four given types (static, pathed, rotating, and blinking), define an in-stage parent, and dynamically dis/enable individual sets in an active scene.

This module has been heavily documented and will work as-is/out of the box. You can try it out here:

https://decentraland-parkour-kit.herokuapp.com/?position=1%2C0&realm=localhost-stub

or by downloading the scene and running it locally (ensure you have the DCL SDK installed).

File Overview:

	-game.ts: demo of on-start code

	-dict.ts: library for lists and dicts
  
	-cmParkourManager: manages platforms and modifies the current set across the scene

	-cmParkourPlatforms: objects used to define platforms and their systems (deployed by manager)

	-cmParkourObjectData: data definitions for platforms to be displayed in the scene (loaded into manager)

	-cmParkourStyleData: data definitions for styles (linkage between code and models that are used to display platforms)
	-cmParkourStyleDict: live and sorted data access for styles (used during run-time)

You can find more information inside each of these files.



If you run into any issues, send me an e-mail at: 
  thecryptotrader69@gmail.com
