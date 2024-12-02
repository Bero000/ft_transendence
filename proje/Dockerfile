# Dockerfile
FROM python:3.10.12

ENV PIP_ROOT_USER_ACTION=ignore \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1
    #PIP_NO_CACHE_DIR=off 

# Copy only requirements.txt first to leverage Docker cache
COPY requirements.txt /proje/requirements.txt

RUN pip install --upgrade pip && pip install -r /proje/requirements.txt

# After the packages are installed, copy the rest of your application
COPY son /proje/son

RUN chmod +x /proje/son/start.sh

EXPOSE 8001

CMD [ "sh", "/proje/son/start.sh" ]