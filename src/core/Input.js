class Input
{
	constructor()
	{
		this.touchX			= -1;
		this.touchY			= -1;
		this.touchDX		= 0;
		this.touchDY		= 0;
	}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

	Update(event)
	{
		let x = event.data.global.x;
		let y = event.data.global.y;

		switch (event.type)
		{
			case "pointerdown":
			{
				// console.log('pointerdown');
				this.touchX	= x;
				this.touchY	= y;
				break;
			}
			case "pointermove":
			{
				// console.log('pointermove');
				this.touchDX = x - this.touchX;
				this.touchDY = y - this.touchY;
				break;
			}
		}
	}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

	Reset(event)
	{
		if (event == null || event.type == "pointerup")
		{
			this.touchX		= -1;
			this.touchY		= -1;
			this.touchDX	= 0;
			this.touchDY	= 0;
		}
	}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

	IsTouchUp(event)
	{
		return event.type == "pointerup";
	}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

	IsTouchDown(event)
	{
		return event.type == "pointerdown";
	}

//--------------------------------------------

	IsTouchUpOutside(event) {
		return event.type == "pointerupoutside";
	}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

	IsTouchMove(event)
	{
		return (event.type == "pointermove" && (this.touchX != -1 || this.touchY != -1) && (this.touchDX != 0 || this.touchDY != 0));
	}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

	IsKeyUp(event)
	{
		return event.type == "keyup";
	}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

	IsKeyDown(event)
	{
		return event.type == "keydown";
	}
}
module.exports = new Input();
