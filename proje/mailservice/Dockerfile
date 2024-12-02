FROM python:3.11

COPY . /mail_service

RUN chmod +x /mail_service/start.sh

RUN pip3 install -r /mail_service/requirements.txt

CMD [ "/mail_service/start.sh" ]