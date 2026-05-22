"""Generate California 100-question JSON and SQL seed files."""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_JSON = ROOT / "supabase" / "seeds" / "california-100.json"
OUT_SQL = ROOT / "supabase" / "seeds" / "california-100.sql"

CATS = [
    ("road signs", 20, "easy"),
    ("right of way", 15, "medium"),
    ("traffic signals", 10, "easy"),
    ("lane changes and turning", 10, "medium"),
    ("parking", 10, "medium"),
    ("speed limits", 10, "easy"),
    ("school zones", 5, "easy"),
    ("emergency vehicles", 5, "medium"),
    ("alcohol/DUI", 5, "hard"),
    ("defensive driving", 10, "medium"),
]

TEMPLATES: dict[str, list[tuple[str, list[str], int, str]]] = {
    "road signs": [
        (
            "What does an octagonal red sign mean?",
            ["Yield to cross traffic", "Stop completely, then go when safe", "Merge left", "No parking anytime"],
            1,
            "Octagon signs are stop signs; you must stop before proceeding.",
        ),
        (
            "A yellow pennant-shaped sign on the left side of the road means:",
            [
                "No passing zone for traffic in both directions",
                "No passing zone for traffic traveling in your direction",
                "School crossing ahead",
                "Lane ends ahead",
            ],
            1,
            "The pennant marks the start of a no-passing zone for your direction of travel.",
        ),
        (
            "An orange sign with black letters usually indicates:",
            ["A recreation area", "Road construction or maintenance", "A hospital zone", "A scenic overlook"],
            1,
            "Orange signs warn of work zones and temporary traffic control.",
        ),
        (
            "A round yellow sign with an X and RR means:",
            ["Rest area ahead", "Railroad crossing ahead", "Roundabout ahead", "Road closed"],
            1,
            "This advance warning sign alerts drivers to an upcoming railroad crossing.",
        ),
        (
            "A fluorescent yellow-green sign is often used for:",
            ["Freeway exits", "School zones and pedestrian areas", "Parking restrictions", "Toll plazas"],
            1,
            "This color improves visibility for school and pedestrian warnings.",
        ),
        (
            "A red circle with a slash over a symbol means:",
            ["The action shown is required", "The action shown is prohibited", "Warning only", "Services available"],
            1,
            "A red slash means the illustrated action is not allowed.",
        ),
        (
            "A diamond-shaped yellow sign warns of:",
            ["Regulatory rules", "Hazards or changing road conditions ahead", "Services", "Motorist services"],
            1,
            "Diamond yellow signs are general warning signs.",
        ),
        (
            "A white rectangular sign typically shows:",
            ["Warnings", "Regulatory rules such as speed limits", "Construction zones", "Scenic routes"],
            1,
            "White rectangles usually communicate laws and regulations.",
        ),
        (
            "A green guide sign on a freeway usually provides:",
            ["Warnings", "Direction and distance information", "Prohibited actions", "School zone limits"],
            1,
            "Green signs help drivers navigate routes and exits.",
        ),
        (
            "A blue sign at a rest area indicates:",
            ["Construction", "Motorist services and information", "No trucks", "Hospital zone"],
            1,
            "Blue signs point to services like food, fuel, and lodging.",
        ),
        (
            "Two solid yellow lines in the center of a two-lane road mean:",
            ["Passing allowed both ways", "Passing is not allowed in either direction", "Passing allowed only at night", "Center lane for turning only"],
            1,
            "Double solid yellow lines prohibit passing from either direction.",
        ),
        (
            "A broken yellow line on your side means:",
            ["You may pass when safe", "No passing ever", "Stop required", "Two-way left turn lane"],
            0,
            "A broken yellow line on your side permits passing when safe.",
        ),
        (
            "A white curb painted red means:",
            ["Loading zone only", "No stopping, standing, or parking", "Passenger pickup only", "Electric vehicle charging"],
            1,
            "Red curbs prohibit stopping except for buses in marked zones.",
        ),
        (
            "A sign showing a curved arrow with a speed number advises:",
            ["Minimum speed in a curve", "Recommended safe speed for the curve", "Maximum legal speed always", "Truck route only"],
            1,
            "Advisory speed signs suggest a safe speed for the curve.",
        ),
        (
            "A triangular sign pointing down means:",
            ["Yield", "Stop", "Merge", "Detour"],
            0,
            "An inverted triangle is a yield sign.",
        ),
        (
            "A flashing yellow arrow for a left turn means:",
            [
                "Protected turn; oncoming traffic stopped",
                "Turn allowed after yielding to oncoming traffic and pedestrians",
                "Left turn prohibited",
                "Stop and wait for green arrow",
            ],
            1,
            "You may turn left but must yield to oncoming traffic and pedestrians.",
        ),
        (
            "A sign with a bicycle symbol marks:",
            ["Bicycles prohibited", "Bicycle lane or route", "Bike shop nearby", "No pedestrians"],
            1,
            "Bicycle symbols mark lanes or shared routes for cyclists.",
        ),
        (
            "A pedestrian symbol on a yellow sign warns:",
            ["Pedestrians prohibited", "Pedestrian crossing or area ahead", "No sidewalk", "School bus stop only"],
            1,
            "These signs alert drivers to watch for people walking.",
        ),
        (
            "A winding road symbol warns that:",
            ["The road is closed", "The road has curves ahead", "Trucks only", "Steep grade ahead"],
            1,
            "The winding road symbol warns of multiple curves ahead.",
        ),
        (
            "A flagger in a work zone means you must:",
            ["Ignore temporary signs", "Follow the flagger instructions", "Speed up to clear the zone", "Use the shoulder"],
            1,
            "Flaggers control traffic and their directions must be obeyed.",
        ),
    ],
    "right of way": [
        (
            "At a four-way stop, who goes first?",
            ["The largest vehicle", "The driver who arrived first", "The driver on the left", "Whoever honks first"],
            1,
            "At four-way stops, the first vehicle to stop generally proceeds first.",
        ),
        (
            "When two vehicles arrive at a four-way stop at the same time, who yields?",
            ["The driver on the right goes first", "The driver on the left goes first", "The faster vehicle", "The truck always goes"],
            0,
            "When arriving together, yield to the driver on your right.",
        ),
        (
            "At an uncontrolled intersection, you should:",
            ["Assume you have the right of way", "Slow down and be ready to yield if needed", "Honk and proceed", "Stop only if a sign is present"],
            1,
            "Slow down and yield to avoid collisions when no signs or signals control the intersection.",
        ),
        (
            "When entering a roundabout, you must yield to:",
            ["Traffic exiting the roundabout", "Traffic already in the roundabout", "Pedestrians only after you enter", "No one"],
            1,
            "Entering traffic must yield to vehicles already circulating.",
        ),
        (
            "A pedestrian in a marked crosswalk has:",
            ["No special right of way", "The right of way", "Right of way only at night", "Right of way only with a green light"],
            1,
            "Drivers must yield to pedestrians in crosswalks.",
        ),
        (
            "When turning left at a green light without an arrow, you must:",
            ["Turn immediately", "Yield to oncoming traffic and pedestrians", "Wait for a green arrow only", "Honk and turn"],
            1,
            "Left turns on solid green require yielding to oncoming traffic and pedestrians.",
        ),
        (
            "At a T-intersection without signs, who must yield?",
            ["The driver on the continuing road", "The driver on the road that ends", "The slower vehicle", "Neither driver"],
            1,
            "The driver on the road that ends must yield to through traffic.",
        ),
        (
            "When a funeral procession is led by an escort with flashing lights, you should:",
            ["Cut into the procession", "Yield and not interrupt the procession", "Pass on the right shoulder", "Honk to warn them"],
            1,
            "Do not break into or interrupt a funeral procession.",
        ),
        (
            "When merging onto a freeway, who has the right of way?",
            ["The merging driver", "Traffic already on the freeway", "The slower vehicle", "Trucks only"],
            1,
            "Drivers on the freeway have the right of way; merge when safe.",
        ),
        (
            "When a school bus has red lights flashing on a two-lane road, you must:",
            ["Pass slowly", "Stop until the lights stop flashing", "Pass if no children visible", "Honk and proceed"],
            1,
            "You must stop for flashing red school bus lights on undivided roads.",
        ),
        (
            "When emergency vehicles approach with sirens and lights, you should:",
            ["Speed up", "Pull to the right edge and stop if safe", "Stop in the intersection", "Follow closely behind"],
            1,
            "Pull right and stop to clear a path for emergency vehicles.",
        ),
        (
            "At a yield sign, you must:",
            ["Stop always for three seconds", "Slow or stop as needed and give right of way", "Maintain speed", "Turn without looking"],
            1,
            "Yield means give right of way; stop if needed.",
        ),
        (
            "If traffic signals are blacked out and not working, treat the intersection as:",
            ["Green light for main road", "A four-way stop", "Free-for-all", "Yield only for left turns"],
            1,
            "A dark signal should be treated as an all-way stop.",
        ),
        (
            "When exiting a driveway onto a street, you must yield to:",
            ["Only pedestrians", "Pedestrians and vehicles on the roadway", "No one if you signal", "Vehicles behind you only"],
            1,
            "Entering traffic must yield to pedestrians and road users.",
        ),
        (
            "If you reach an intersection with a non-functioning signal at the same time as another car, you should:",
            ["Proceed quickly", "Treat it as a four-way stop and take turns safely", "Honk to claim right of way", "Turn left first always"],
            1,
            "Use caution and follow four-way stop rules when signals fail.",
        ),
    ],
    "traffic signals": [
        (
            "A steady red light means:",
            ["Slow down", "Stop and remain stopped until the light turns green", "Proceed with caution", "Yield only to the right"],
            1,
            "Stop at the limit line or crosswalk and wait for green.",
        ),
        (
            "A steady yellow light means:",
            ["Speed up", "The light is about to turn red; stop if you can do so safely", "Go immediately", "Stop only at night"],
            1,
            "Yellow warns the signal is changing; stop safely if possible.",
        ),
        (
            "A flashing red light means:",
            ["Proceed without stopping", "Stop, then go when safe", "Yield only", "Green light coming"],
            1,
            "Treat a flashing red like a stop sign.",
        ),
        (
            "A flashing yellow light means:",
            ["Stop", "Slow down and proceed with caution", "Road closed", "No right turn"],
            1,
            "Flashing yellow warns drivers to proceed carefully.",
        ),
        (
            "A green arrow pointing left allows you to:",
            ["Turn left with a protected movement if no sign prohibits", "Turn left without yielding", "Go straight only", "Park in the intersection"],
            0,
            "A green arrow gives a protected turn in that direction.",
        ),
        (
            "A red arrow pointing left means:",
            ["Turn left after yielding", "Do not turn left until the arrow changes", "Stop only if pedestrians present", "Merge left"],
            1,
            "You may not turn in the direction of a red arrow.",
        ),
        (
            "If the light turns yellow as you approach, you should:",
            ["Accelerate to beat the red", "Stop if you can do so safely", "Ignore it", "Honk"],
            1,
            "Do not speed up for yellow; stop safely when possible.",
        ),
        (
            "At a red light, a right turn is allowed when:",
            ["Never", "After stopping and yielding unless a sign prohibits it", "Without stopping if clear", "Only with a green arrow"],
            1,
            "Right on red is allowed after a full stop and yielding unless posted otherwise.",
        ),
        (
            "Pedestrian countdown numbers show:",
            ["Speed limit", "Seconds left to cross for pedestrians", "Parking time limit", "Bus schedule"],
            1,
            "Countdowns tell pedestrians how much crossing time remains.",
        ),
        (
            "If a traffic signal is green but traffic is blocking the intersection, you should:",
            ["Enter and wait in the intersection", "Wait until you can clear the intersection completely", "Honk", "Use the shoulder"],
            1,
            "Do not block the box; wait until you can clear the intersection.",
        ),
    ],
    "lane changes and turning": [
        (
            "Before changing lanes, you should:",
            ["Signal and check mirrors and blind spots", "Signal only on freeways", "Change quickly without signaling", "Honk continuously"],
            0,
            "Signal early and check mirrors and blind spots before moving.",
        ),
        (
            "When turning right, you should usually turn from:",
            ["The lane closest to the right curb", "Any open lane", "The center lane", "The shoulder"],
            0,
            "Right turns are normally made from the rightmost lane.",
        ),
        (
            "When turning left from a two-way street onto a two-way street, start from:",
            ["The far right lane", "The lane closest to the center line or marked left-turn lane", "The shoulder", "Any lane"],
            1,
            "Begin left turns from the lane nearest the center or a marked turn lane.",
        ),
        (
            "A U-turn in a business district is:",
            ["Always legal", "Legal only at intersections or openings unless prohibited", "Always illegal", "Legal anywhere at night"],
            1,
            "In business districts, U-turns are limited to intersections or openings unless posted.",
        ),
        (
            "You must signal at least how long before a turn in California?",
            ["50 feet", "100 feet", "200 feet", "500 feet"],
            1,
            "California law requires signaling at least 100 feet before turning.",
        ),
        (
            "When passing a bicyclist, California law generally requires:",
            ["Honk continuously", "At least three feet of space when passing", "Pass in the same lane at any speed", "Flash high beams"],
            1,
            "Give at least three feet of clearance when passing a bicyclist.",
        ),
        (
            "If your lane ends and you must merge, you should:",
            ["Stop in the lane", "Match speed, signal, and merge when safe", "Force other drivers to slow", "Use the median"],
            1,
            "Adjust speed and merge smoothly when a lane ends.",
        ),
        (
            "When making a legal U-turn, you must yield to:",
            ["No one", "All approaching traffic and pedestrians", "Only trucks", "Only vehicles behind you"],
            1,
            "Yield to all traffic and pedestrians before completing a U-turn.",
        ),
        (
            "Hand signals are required if:",
            ["You are on a freeway", "Your turn signals are not working", "It is raining", "You are parking"],
            1,
            "Use hand signals if electronic signals fail.",
        ),
        (
            "When turning across a bike lane before a right turn, you should:",
            ["Merge into the bike lane when safe before turning", "Turn across without looking", "Stop in the travel lane", "Honk at cyclists"],
            0,
            "Enter the bike lane within 200 feet of the turn when safe.",
        ),
    ],
    "parking": [
        (
            "When parking downhill with a curb, turn your front wheels:",
            ["Toward the curb", "Away from the curb", "Straight ahead", "Toward the street"],
            0,
            "Turn wheels toward the curb so the vehicle rolls into the curb if it moves.",
        ),
        (
            "When parking uphill with a curb, turn your front wheels:",
            ["Toward the curb", "Away from the curb (toward the street)", "Straight", "Left only"],
            1,
            "Turn wheels away from the curb so the vehicle rolls into the curb if it rolls back.",
        ),
        (
            "A blue curb means:",
            ["Loading zone", "Parking for disabled persons with a valid placard", "No parking", "Taxi only"],
            1,
            "Blue curbs are for disabled parking with proper placards or plates.",
        ),
        (
            "A green curb means:",
            ["No stopping", "Limited-time parking as posted", "Bus zone", "Fire lane"],
            1,
            "Green curbs allow short-term parking for the posted time.",
        ),
        (
            "You may not park within how many feet of a fire hydrant?",
            ["5 feet", "10 feet", "15 feet", "20 feet"],
            2,
            "Do not park within 15 feet of a fire hydrant.",
        ),
        (
            "You may not park within how many feet of a crosswalk at an intersection?",
            ["10 feet", "15 feet", "20 feet", "25 feet"],
            2,
            "Stay far enough from crosswalks so pedestrians remain visible.",
        ),
        (
            "Double parking means:",
            ["Parking between two spaces", "Parking on the roadway beside a parked vehicle", "Parking in a garage", "Parking at a meter"],
            1,
            "Double parking blocks traffic and is illegal.",
        ),
        (
            "When parallel parking, your wheels should be within how many inches of the curb?",
            ["6 inches", "18 inches", "36 inches", "Any distance"],
            1,
            "Wheels should generally be within 18 inches of the curb.",
        ),
        (
            "You must not leave a child under what age alone in a vehicle if unsafe?",
            ["6 years", "8 years", "10 years", "12 years"],
            1,
            "Leaving young children unattended in vehicles can be dangerous and illegal.",
        ),
        (
            "Parking in a space marked for disabled persons without a placard is:",
            ["Allowed at night", "Illegal", "Allowed for five minutes", "Allowed with hazards on"],
            1,
            "Disabled spaces require proper placards or plates.",
        ),
    ],
    "speed limits": [
        (
            "California default speed limit in a residential or business district unless posted is:",
            ["15 mph", "25 mph", "35 mph", "45 mph"],
            1,
            "The default limit is 25 mph unless otherwise posted.",
        ),
        (
            "Unless posted otherwise, the speed limit in a school zone when children are present is:",
            ["15 mph", "25 mph", "35 mph", "45 mph"],
            1,
            "School zones are commonly 25 mph when children are present.",
        ),
        (
            "On most California freeways, the maximum speed limit unless posted is:",
            ["55 mph", "65 mph", "75 mph", "85 mph"],
            1,
            "Many freeways have a 65 mph limit unless posted otherwise.",
        ),
        (
            "When driving in fog, you should:",
            ["Use high beams", "Slow down and use low-beam headlights", "Drive the posted limit", "Follow closely"],
            1,
            "Low beams reduce glare; slow down in fog.",
        ),
        (
            "The Basic Speed Law means you must never drive faster than is:",
            ["Posted on the sign only", "Reasonable for current conditions", "What other drivers are doing", "50 mph"],
            1,
            "You must drive at a speed reasonable for conditions even if under the posted limit.",
        ),
        (
            "When towing a trailer, you should usually:",
            ["Drive faster to reduce delay", "Drive slower and allow more following distance", "Use high beams always", "Pass frequently"],
            1,
            "Heavier loads need slower speeds and more space.",
        ),
        (
            "Speed limits in highway construction zones when workers are present:",
            ["Never change", "May be reduced and must be obeyed", "Are suggestions only", "Apply only to trucks"],
            1,
            "Reduced limits in work zones protect workers and must be followed.",
        ),
        (
            "If you are driving 65 mph in rain on a crowded freeway, you are likely:",
            ["Following the Basic Speed Law", "Driving too fast for conditions", "Driving too slow", "Exempt from limits"],
            1,
            "Rain reduces traction; slower speeds are often required.",
        ),
        (
            "When approaching a blind curve, you should:",
            ["Maintain speed in your lane", "Slow down and keep right", "Cross the center line", "Stop in the lane"],
            1,
            "Slow down and stay right to avoid oncoming traffic you cannot see.",
        ),
        (
            "Driving well below the speed limit in normal traffic can be:",
            ["Always safest", "Dangerous and impede traffic flow", "Required", "Illegal only on freeways"],
            1,
            "Driving too slowly can block traffic and increase risk.",
        ),
    ],
    "school zones": [
        (
            "Near a school when children are outside, you should:",
            ["Maintain normal speed", "Slow down and watch for children", "Honk often", "Use high beams"],
            1,
            "Expect unpredictable child movements near schools.",
        ),
        (
            "A crossing guard showing a stop sign means you must:",
            ["Slow down", "Stop and remain stopped until directed to proceed", "Go around quickly", "Only stop if children are in your lane"],
            1,
            "Obey crossing guards like traffic control officers.",
        ),
        (
            "School zone signs often use which color for visibility?",
            ["Orange", "Fluorescent yellow-green", "Blue", "Brown"],
            1,
            "Fluorescent yellow-green improves visibility for school warnings.",
        ),
        (
            "When a school bus stops on your side of an undivided road with flashing red lights, you:",
            ["May pass at 10 mph", "Must stop until the lights stop flashing", "May pass if no kids visible", "Must honk"],
            1,
            "On your side of the road, stop for the bus red lights.",
        ),
        (
            "Children are most at risk when:",
            ["On sidewalks only", "Entering or leaving school buses and crossing streets", "Inside classrooms", "On freeways"],
            1,
            "Loading and unloading zones require extra driver caution.",
        ),
    ],
    "emergency vehicles": [
        (
            "When you see a stationary emergency vehicle with flashing lights on a freeway, you should:",
            ["Maintain speed", "Move over a lane away if safe, or slow down", "Stop immediately in your lane", "Take photos"],
            1,
            "Move over or slow down for stopped emergency vehicles (Move Over law).",
        ),
        (
            "If an emergency vehicle approaches from behind with lights and siren, you should:",
            ["Stop in the intersection", "Pull to the right and stop when safe", "Speed up", "Turn left quickly"],
            1,
            "Pull right and stop to let emergency vehicles pass.",
        ),
        (
            "It is illegal to follow an emergency vehicle responding to a call within:",
            ["100 feet", "300 feet", "500 feet", "1000 feet"],
            2,
            "Do not follow within 500 feet of responding emergency vehicles.",
        ),
        (
            "If you are in an intersection when an emergency vehicle approaches, you should:",
            ["Stop in the intersection", "Clear the intersection, then pull over", "Back up", "Turn off your lights"],
            1,
            "Clear the intersection first, then pull over safely.",
        ),
        (
            "You must not drive over fire hoses unless:",
            ["You are late", "Authorized by a fire official", "Traffic is heavy", "You have four-wheel drive"],
            1,
            "Only cross fire hoses when authorized by fire personnel.",
        ),
    ],
    "alcohol/DUI": [
        (
            "For drivers under 21 in California, any measurable alcohol in the blood is:",
            ["Allowed up to 0.05%", "Illegal (zero tolerance)", "Allowed with parental consent", "Allowed on highways only"],
            1,
            "Drivers under 21 may not drive with any measurable alcohol.",
        ),
        (
            "The legal BAC limit for drivers 21 and older is generally:",
            ["0.02%", "0.08%", "0.10%", "0.15%"],
            1,
            "0.08% BAC is the general legal limit for adults 21 and over.",
        ),
        (
            "Implied consent means if you are arrested for DUI you must:",
            ["Pay a fine on the spot", "Submit to a chemical test of your blood or breath", "Surrender your vehicle permanently", "Take a road test"],
            1,
            "Licensed drivers agree to chemical testing when lawfully arrested for DUI.",
        ),
        (
            "A DUI conviction can result in:",
            ["License suspension and fines", "Only a warning", "No insurance change", "Automatic expungement"],
            0,
            "DUI can lead to suspension, fines, and other penalties.",
        ),
        (
            "The best way to avoid DUI is to:",
            ["Drink coffee after alcohol", "Plan a sober ride before drinking", "Drive slowly", "Open windows while driving"],
            1,
            "Plan ahead with a sober driver or ride service.",
        ),
    ],
    "defensive driving": [
        (
            "The three-second rule helps you maintain:",
            ["Speed", "A safe following distance", "Lane position", "Fuel economy"],
            1,
            "Pick a fixed point; when the car ahead passes it, you should reach it in at least three seconds.",
        ),
        (
            "If another driver is tailgating you, you should:",
            ["Brake suddenly", "Increase following distance ahead and change lanes when safe", "Speed up sharply", "Block them"],
            1,
            "Increase space ahead so you can brake gradually if needed.",
        ),
        (
            "When you feel drowsy while driving, you should:",
            ["Open windows and keep driving", "Pull off in a safe place and rest", "Drink only soda", "Speed up to arrive faster"],
            1,
            "Rest is the safest response to drowsy driving.",
        ),
        (
            "Hydroplaning is best handled by:",
            ["Braking hard", "Easing off the gas and steering straight until traction returns", "Accelerating", "Turning sharply"],
            1,
            "Ease off the accelerator and steer straight until you regain control.",
        ),
        (
            "If your vehicle starts to skid, you should:",
            ["Steer in the direction you want to go and avoid sudden braking", "Brake hard immediately", "Accelerate", "Close your eyes briefly"],
            0,
            "Steer smoothly toward your intended path and avoid abrupt inputs.",
        ),
        (
            "Scanning the road 10 to 15 seconds ahead helps you:",
            ["Use your phone safely", "See hazards early", "Speed in traffic", "Ignore mirrors"],
            1,
            "Looking far ahead gives time to react to hazards.",
        ),
        (
            "Large trucks have bigger blind spots called:",
            ["Safety zones", "No-zones", "Free zones", "Pass zones"],
            1,
            "Stay out of truck no-zones where the driver cannot see you.",
        ),
        (
            "At night, you should dim high beams within how many feet of an oncoming vehicle?",
            ["200 feet", "500 feet", "1000 feet", "1500 feet"],
            1,
            "Dim high beams within 500 feet of oncoming traffic.",
        ),
        (
            "If your right wheels drop off the pavement, you should:",
            ["Jerk the wheel back quickly", "Grip the wheel, ease off the gas, and return when safe", "Brake hard", "Accelerate back"],
            1,
            "Ease off the gas and re-enter gradually when safe.",
        ),
        (
            "Defensive driving means:",
            ["Assuming other drivers will always yield", "Anticipating hazards and driving to prevent collisions", "Driving the speed limit always", "Using hazard lights often"],
            1,
            "Defensive driving focuses on preventing crashes before they happen.",
        ),
    ],
}


def main() -> None:
    questions: list[dict] = []

    for category, count, default_difficulty in CATS:
        bank = TEMPLATES.get(category, [])
        for index in range(count):
            if index < len(bank):
                prompt, choices, answer_index, explanation = bank[index]
                difficulty = default_difficulty
            else:
                prompt = f"When practicing {category} in California, what is the safest general rule?"
                choices = [
                    "Ignore posted signs",
                    "Follow signs, signals, and drive for conditions",
                    "Drive as fast as traffic allows",
                    "Use hazard lights often",
                ]
                answer_index = 1
                explanation = "Safe driving means obeying traffic controls and adjusting to conditions."
                difficulty = default_difficulty

            questions.append(
                {
                    "state_code": "CA",
                    "prompt": prompt,
                    "choices": choices,
                    "answer_index": answer_index,
                    "explanation": explanation,
                    "category": category,
                    "difficulty": difficulty,
                }
            )

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(questions, indent=2), encoding="utf-8")

    sql_rows: list[str] = []
    for question in questions:
        choices_json = json.dumps(question["choices"]).replace("'", "''")
        prompt = question["prompt"].replace("'", "''")
        explanation = question["explanation"].replace("'", "''")
        category = question["category"].replace("'", "''")
        sql_rows.append(
            "  ("
            f"'CA', '{prompt}', '{choices_json}'::jsonb, {question['answer_index']}, "
            f"'{explanation}', '{category}', '{question['difficulty']}', "
            "'drivesight-ca-100', true)"
        )

    sql = "\n".join(
        [
            "-- California 100 question seed (educational practice only)",
            "delete from public.driving_test_questions where state_code = 'CA' and source = 'drivesight-ca-100';",
            "insert into public.driving_test_questions (state_code, prompt, choices, answer_index, explanation, category, difficulty, source, is_active)",
            "values",
            ",\n".join(sql_rows) + ";",
            "update public.state_driving_tests set question_count = 100, updated_at = now() where state_code = 'CA';",
        ]
    )
    OUT_SQL.write_text(sql, encoding="utf-8")
    print(f"Wrote {len(questions)} questions to {OUT_JSON.name} and {OUT_SQL.name}")


if __name__ == "__main__":
    main()
