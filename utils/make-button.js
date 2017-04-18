function makeButton(x, y, width, height, text, switchedOn)
{
    button = {};
    button.x = x;
    button.y = y;
    button.width = width;
    button.height = height;
    button.text = text;
    button.switchedOn = switchedOn;

    button.draw = function(ctx)
    {
        var radius = 10;
        ctx.strokeStyle = palePink;
        ctx.fillStyle = palePink;
        ctx.globalAlpha = 1.0;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 2*radius;

        ctx.beginPath();
        ctx.moveTo(this.x+radius, this.y+radius);
        ctx.lineTo(this.x+this.width-radius, this.y+radius);
        ctx.lineTo(this.x+this.width-radius, this.y+this.height-radius);
        ctx.lineTo(this.x+radius, this.y+this.height-radius);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        ctx.font="16px Arial";
        ctx.textAlign = "center";
        if (this.switchedOn)
        {
            ctx.fillStyle = "orchid";
            ctx.globalAlpha = 0.6;
        }
        else
        {
            ctx.fillStyle = "white";
            ctx.globalAlpha = 1.0;
        }
        this.drawText(ctx);
    };

    button.drawText = function(ctx)
    {
        ctx.fillText(this.text, this.x+this.width/2, this.y+this.height/2+6);
    };

    button.handleTouchStart = function(touch)
    {
        if (touch.x>=this.x && touch.x <= this.x + this.width
            && touch.y >= this.y && touch.y <= this.y + this.height)
        {
            this.switchedOn = !this.switchedOn;
        }
    };

    return button;
}
