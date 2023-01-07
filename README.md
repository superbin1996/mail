> # Project App: `Mail`

`Usage`:  
https://youtu.be/C2r7sG70Oek

________________
## Project structure

- `server` directory is project folder,   
- `mail` directory is app folder,   
- `mail/templates/mail` directory store template files     
________________

> ### To setup project (work both for production and development)  


#### Setup backend
- In `root directory` on terminal i (if `npm` and `python` was installed):  
    - [**Create python visual environment and activate it**](https://www.infoworld.com/article/3239675/virtualenv-and-venv-python-virtual-environments-explained.html)   
    After that, run:  

        ```py
        pip install -r requirements.txt
        ```
This command will install all packages listed in `requirements.txt`

________________
## To run project (development): 

on terminal in `root directory`, run:  

- On `windows`:
    ```js
    python manage.py runserver
    ```

- On `ubuntu`:
    ```js
    python3 manage.py runserver
    ```


