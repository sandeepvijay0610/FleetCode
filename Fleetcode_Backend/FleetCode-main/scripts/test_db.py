from config.db import init_db
from models.squad import Squad
from models.user import User
from models.submission import Submission

def run_test():
    init_db()

    print("COnnected to db")

    # 🔥 Clean old data (optional)
    Squad.drop_collection()
    User.drop_collection()
    Submission.drop_collection()

    print("🚀 Testing DB...")

    # 1. Create Squad
    squad = Squad(squad_name="Tee-Toddlers").save()
    print("✅ Squad created")

    # 2. Create User
    user = User(username="sandeepvijay0610", squad=squad).save()
    print("✅ User created")

    # 3. Create Submission
    sub = Submission(
        username=user.username,
        squad=squad,
        problem_name="Two Sum",
        difficulty="Easy",
        topic_tags=["Arrays"]
    ).save()
    print("✅ Submission created")

    # 4. Fetch + Verify
    latest = Submission.objects.first()
    print("\n📊 Latest Submission:")
    print(latest.problem_name)
    print(latest.username)
    print(latest.squad.squad_name)

    # 5. Update Stats
    user.stats.Arrays += 1
    user.save()

    print("\n🔥 Updated Stats:", user.stats.Arrays)

if __name__ == "__main__":
    run_test()