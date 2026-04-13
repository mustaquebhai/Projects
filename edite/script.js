const filters={
    brightness:{
        value:100,
        min:0,
        max:200,
        unit:"%"
    },
    contrast:{
        value:100,
        min:0,
        max:200,
        unit:"%"
    },
    saturation:{
        value:100,
        min:0,
        max:200,
        unit:"%"
    },
    hueRotation:{
        value:0,
        min:0,
        max:360,
        unit:"deg"
    },
    blur:{
        value:0,
        min:0,
        max:20,
        unit:"px"
    },
    grayscale:{
        value:0,
        min:0,
        max:100,
        unit:"%"
    },
    sepia:{
        value:0,
        min:0,
        max:100,
        unit:"%"
    },
    opacity:{
        value:100,
        min:0,
        max:100,
        unit:"%"
    },
    invert:{
        value:0,
        min:0,
        max:100,
        unit:"%"
    },
};
let filterContainer=document.querySelector(".filters");
let imageCanvas=document.querySelector("#image-canvas");
let imageInput=document.querySelector("#image-input");
const canvasCtx=imageCanvas.getContext("2d");
let img = null;
let drawWidth, drawHeight, x, y;
let resetbtn=document.querySelector("#btn-reset");
let downloadButton=document.querySelector("#btn-download");
function createFilterElement(name,unit,value,min,max){
    const div=document.createElement("div");
    div.classList.add("filter");
    const input=document.createElement("input");
    input.type="range";
    input.min=min;
    input.max=max;
    input.value=value;
    input.id=name;
    const p=document.createElement("p");
    p.innerText=name;
    div.appendChild(p);
    div.appendChild(input);
    input.addEventListener("input",function(event){
        filters[name].value=input.value;
        applyFilters()
    });
    return div;
}
function createFilters(){
    Object.keys(filters).forEach(key=>{
    const filterElement=createFilterElement(key,filters[key].unit,filters[key].value,filters[key].min,filters[key].max);
    filterContainer.appendChild(filterElement);
});
}
createFilters()
imageInput.addEventListener("change",(event)=>{
    const file=event.target.files[0];
    if(!file) return;
    const imagePlaceholder=document.querySelector(".placeholder");
    imagePlaceholder.style.display="none";
    imageCanvas.style.display="block";
    img=new Image();
    img.src=URL.createObjectURL(file)
    img.onload = () => {
    const container = imageCanvas.parentElement;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const imgRatio = img.width / img.height;
    const containerRatio = containerWidth / containerHeight;

    if (imgRatio > containerRatio) {
        drawWidth = containerWidth * 0.9; 
        drawHeight = drawWidth / imgRatio;
    } else {
        drawHeight = containerHeight * 0.9;
        drawWidth = drawHeight * imgRatio;
    }

    imageCanvas.width = containerWidth;
    imageCanvas.height = containerHeight;
    x = (containerWidth - drawWidth) / 2;
    y = (containerHeight - drawHeight) / 2;

    canvasCtx.clearRect(0, 0, containerWidth, containerHeight);
    canvasCtx.drawImage(img, x, y, drawWidth, drawHeight);
    applyFilters();
}  
});
function applyFilters(){
    if(!img) return;
    canvasCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
    canvasCtx.filter=`
    brightness(${filters.brightness.value}${filters.brightness.unit})
    contrast(${filters.contrast.value}${filters.contrast.unit})
    saturate(${filters.saturation.value}${filters.saturation.unit})
    hue-rotate(${filters.hueRotation.value}${filters.hueRotation.unit})
    blur(${filters.blur.value}${filters.blur.unit})
    grayscale(${filters.grayscale.value}${filters.grayscale.unit})
    sepia(${filters.sepia.value}${filters.sepia.unit})
    opacity(${filters.opacity.value}${filters.opacity.unit})
    invert(${filters.invert.value}${filters.invert.unit})`;
    canvasCtx.drawImage(img, x, y, drawWidth, drawHeight);
}
resetbtn.addEventListener("click", () => {
    Object.keys(filters).forEach(key => {
        if (key === "hueRotation") {
            filters[key].value = 0;
        } else if (key === "blur") {
            filters[key].value = 0;
        } else {
            filters[key].value = (key === "brightness" || key === "contrast" || key === "saturation" || key === "opacity") ? 100 : 0;
        }
    });
    document.querySelectorAll(".filters input").forEach(input => {
        const key = input.id;
        input.value = filters[key].value;
    });
    applyFilters();
});
downloadButton.addEventListener("click", () => {
    const dataURL = imageCanvas.toDataURL();
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "edited-image.png";
    document.body.appendChild(link);
    link.dispatchEvent(new MouseEvent("click"));
    document.body.removeChild(link);
});