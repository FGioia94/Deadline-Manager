class Asset():
    def __init__(self, name):
        self.name = name
        self.tasks = {}

    def add_department(self, department):
        if not department in self.tasks:
            self.tasks[department] = {}

    def add_task(self, 
                 name, 
                 department,
                 artist = None):
        
        if not department in self.tasks:
            self.add_department(department)

        self.tasks[department] = Task(name, department, artist)

class Task():
    def __init__(self, 
                 name, 
                 department, 
                 artist = None, 
                 deadline = None, 
                 status = "not_started"):
        self.name = name
        self.department = department
        self.artist = artist
        self.deadline = deadline
        self.status = status

