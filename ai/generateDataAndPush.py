import firebase_admin, json, random, string
from firebase_admin import credentials, db

cred = credentials.Certificate("uptime-69073-firebase-adminsdk-6wylj-bfbf8cb7e4.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://uptime-69073.firebaseio.com'
})

test_users = {}

user_numbers = range(1, 4)
user_alpha = "abdcef"
increments = range(8, 50, 2)

categories = {
    'homework': [('SI501', 'SI401', 'SI582'), ('Homework', 'Assignment', 'Essay', 'Project')], 
    'chore': [('Shopping', 'Cleaning', 'Cooking'), ('for', 'at', 'the'), ('mall', 'room', 'eggs')], 
    'selfdev': [('Study', 'Online course', 'Workout', 'Meditate'), ('for', 'on'), ('Calculus', 'Trigonometry', 'Statistics', '2 hours')]
}

duration = [x for x in range(30, 181, 30)]

for category in categories:
    for x in range(0, 101):
        title = ""
        for tpl in categories[category]:
            title += (random.choice(tpl) + " ")
        title = title[:-1]
        user = random.choice(user_alpha) + str(random.choice(user_numbers))
        exp_dur = random.choice(duration)
        act_dur = exp_dur + (random.random() * random.choice(increments) * random.choice([1, -1]))
        if category not in test_users:
            test_users[category] = []
        test_users[category].append({
            'title': title,
            'exp_dur': exp_dur,
            'act_dur': act_dur,
            'user_id': user
        })

test_users_ref = db.reference('history')
test_users_ref.set(test_users)
