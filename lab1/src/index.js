"use strict"
console.log("asdf");
let context = document.getElementById("gameScreen");
let ctx = context.getContext('2d');
ctx.font = "10px Arial";
const FieldSizeX = 60;
const FieldSizeY =50;
const CellSize = 10;
let Play = false;

let Field = [];

function CreateField()
{
	let newField = [];
	for(let i = 0 ; i < FieldSizeX; i++)
	{
		newField[i] = [];
	}
	return newField;
}

function Draw()
{
	ctx.fillStyle = "#111111";
	ctx.fillRect(0,0,(CellSize+1)*FieldSizeX,(CellSize+1)*FieldSizeY);
	for(let y = 0; y < FieldSizeY; y++)
	{
		for(let x = 0; x < FieldSizeX; x++)
		{
			if (Field[x][y] === true)
			{
				ctx.fillStyle = "green";
			}
			else
			{
				ctx.fillStyle = "black";
			}
			
			ctx.fillRect(x * (CellSize + 1), y * (CellSize + 1), CellSize, CellSize);
		}
	}
	ctx.fillStyle = "gray";
	ctx.fillRect(FieldSizeX*(CellSize + 1),0,100,2*(CellSize+1) - 2);
	ctx.fillRect(FieldSizeX*(CellSize + 1),2*(CellSize+1),100,2*(CellSize+1) - 2);
	ctx.fillStyle = "black";
	ctx.fillText("Step",(CellSize+1)*FieldSizeX,CellSize);
	ctx.fillText("Play/Stop",(CellSize+1)*FieldSizeX,3*(CellSize+1));
}

function Check(x,y)
{
	if (x < 0)
	{
		x += FieldSizeX;
	}
	if (x >= FieldSizeX)
	{
		x -= FieldSizeX;
	}
	if (y < 0)
	{
		y += FieldSizeY;
	}
	if (y >= FieldSizeY)
	{
		y -= FieldSizeY;
	}
	return (Field[x][y] == true);
}

function Step()
{
	let temp = CreateField();
	for (let y = 0; y < FieldSizeY; y++)
	{
		for(let x = 0; x < FieldSizeX; x++)
		{
			let count = 0;
			if (Check(x+1,y+1)) count++;
			if (Check(x+0,y+1)) count++;
			if (Check(x-1,y+1)) count++;
			if (Check(x+1,y+0)) count++;
			if (Check(x-1,y+0)) count++;
			if (Check(x+1,y-1)) count++;
			if (Check(x+0,y-1)) count++;
			if (Check(x-1,y-1)) count++;
			
			temp[x][y] = ((!Field[x][y] && count == 3 )|| (Field[x][y] && (count == 2 || count == 3 )));
		}
	}
	console.log("step");
	Field = temp;
	Draw();
}

function ClickHandler(event)
{
	let x = parseInt((event.pageX - CellSize/2 - 2) / (CellSize + 1));
	let y = parseInt((event.pageY - CellSize/2 - 2) / (CellSize + 1));
	
	
	
	if (x < FieldSizeX && y < FieldSizeY)
	{
		Field[x][y] = !Field[x][y];
		console.log("Click on field",x,y);
	}else
	{
		if (x > FieldSizeX && x <= FieldSizeX + 10)
		{
			y = parseInt(y/2);
			if (y == 0)
			{
				Step();
			}
			if (y == 1)
			{
				Play = !Play;
			}
		}
		
	}
	Draw();
}






//MAIN

Field = CreateField();

Field[10][10] = true;

Draw();

context.addEventListener("mousedown", ClickHandler, false);

setInterval(function(){if (Play){Step()}},10);
