from fastapi import FastAPI, Form, UploadFile, File, Request, Response
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict
import cv2
import io
from starlette.responses import Response
import numpy as np
from io import BytesIO


app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# video streaming section

frame0 = None
frame1 = None

@app.post("/video-stream0/")
async def video_stream0(request: Request):
    global frame0
    image_data = await request.body()
    np_array = np.frombuffer(image_data, np.uint8)
    frame0 = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

    if frame0 is None:
        return {"error": "Failed to decode image"}
    
    return {"message": "Frame 0 received"}

@app.post("/video-stream1/")
async def video_stream1(request: Request):
    global frame1
    image_data = await request.body()
    np_array = np.frombuffer(image_data, np.uint8)
    frame1 = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

    if frame1 is None:
        return {"error": "Failed to decode image"}
    
    return {"message": "Frame 1 received"}

def generate_frames(frame_id: int):
    global frame0, frame1
    while True:
        current_frame = frame0 if frame_id == 0 else frame1
        if current_frame is not None:
            _, buffer = cv2.imencode('.jpg', current_frame)
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

@app.get("/video-feed0/")
def video_feed0():
    return StreamingResponse(generate_frames(0), media_type="multipart/x-mixed-replace; boundary=frame")

@app.get("/video-feed1/")
def video_feed1():
    return StreamingResponse(generate_frames(1), media_type="multipart/x-mixed-replace; boundary=frame")


#weight section

data_store = {
    "weight1": "0.0",
    "weight2": "0.0",
    "weight3": "0.0"
}

# POST endpoints to upload weight from each ESP32 source
@app.post("/upload-weight-1/")
async def upload_weight_1(request: Request):
    data = await request.json()
    weight = data.get("weight")
    data_store["weight1"] = weight
    print(f"Weight 1: {weight}")
    return JSONResponse(content={"message": "Weight 1 uploaded successfully", "weight": weight})

@app.post("/upload-weight-2/")
async def upload_weight_2(request: Request):
    data = await request.json()
    weight = data.get("weight")
    data_store["weight2"] = weight
    print(f"Weight 2: {weight}")
    return JSONResponse(content={"message": "Weight 2 uploaded successfully", "weight": weight})

@app.post("/upload-weight-3/")
async def upload_weight_3(request: Request):
    data = await request.json()
    weight = data.get("weight")
    data_store["weight3"] = weight
    print(f"Weight 3: {weight}")
    return JSONResponse(content={"message": "Weight 3 uploaded successfully", "weight": weight})

# GET endpoints to retrieve current weight from each source
@app.get("/weightitem 1")
def get_weight_1() -> Dict:
    return {"weight": data_store["weight1"]}

@app.get("/weightitem 2")
def get_weight_2() -> Dict:
    return {"weight": data_store["weight2"]}

@app.get("/weightitem 3")
def get_weight_3() -> Dict:
    return {"weight": data_store["weight3"]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

