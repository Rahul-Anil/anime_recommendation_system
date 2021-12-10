# Python 3.8
FROM python:3.8

# LABEL about the custom image
LABEL maintainer="z3417618@ad.unsw.edu.au"
LABEL version="0.1"
LABEL description="This is custom Docker Image for COMP9900 2021 T3 Project"

# Add Directory
ADD . /COMP9900-backend
WORKDIR /COMP9900-backend

# Expose Port
EXPOSE 8080

# Upgrade pip
RUN pip3 install --upgrade pip

# Install Requirements
RUN pip install lightfm
RUN pip install -r requirements.txt
RUN apt-get update && apt-get install -y python3-opencv
RUN pip install opencv-python


# Entry Point
ENTRYPOINT ["bash", "./run.sh"]