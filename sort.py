import json

# Load the original JSON file
with open('horarios.json', 'r') as file:
    data = json.load(file)

# Initialize a new dictionary to store the reformatted data
reformatted_data = {}

# Iterate through each entry in the original data
for entry in data:
    asignatura_id = entry["Código"]
    if asignatura_id not in reformatted_data:
        reformatted_data[asignatura_id] = {
            "Nombre": entry["Nombre"],
            "Curso": entry["Curso"],
            "Interactivas": {
                "Dia": [-1, -1, -1, -1, -1, -1, -1, -1],
                "Inicio": [-1, -1, -1, -1, -1, -1, -1, -1],
                "Fin": [-1, -1, -1, -1, -1, -1, -1, -1],
                "Aula": ["", "", "", "", "", "", "", ""]
            },
            "Expositivas":{
                "Dia":[],
                "Inicio":[],
                "Fin":[],
                "Aula":[]
            },
            "Seminarios":{
                "Dia":[],
                "Inicio":[],
                "Fin":[],
                "Aula":[]
            },

        }

    grupo_index = entry["Grupo"] - 1
    tipo = entry["Tipo"]
    print(f"Processing {asignatura_id} - Grupo: {grupo_index + 1}, Tipo: {tipo}")

    if tipo == "I":
        reformatted_data[asignatura_id]["Interactivas"]["Dia"][grupo_index] = entry["Día"]
        reformatted_data[asignatura_id]["Interactivas"]["Inicio"][grupo_index] = entry["Inicio"]
        reformatted_data[asignatura_id]["Interactivas"]["Fin"][grupo_index] = entry["Fin"]
        reformatted_data[asignatura_id]["Interactivas"]["Aula"][grupo_index] = entry["Aula"]
    elif tipo == "E":
        reformatted_data[asignatura_id]["Expositivas"]["Dia"].append(entry["Día"])
        reformatted_data[asignatura_id]["Expositivas"]["Inicio"].append(entry["Inicio"])
        reformatted_data[asignatura_id]["Expositivas"]["Fin"].append(entry["Fin"])
        reformatted_data[asignatura_id]["Expositivas"]["Aula"].append(entry["Aula"])
    elif tipo == "S":
        reformatted_data[asignatura_id]["Seminarios"]["Dia"].append(entry["Día"])
        reformatted_data[asignatura_id]["Seminarios"]["Inicio"].append(entry["Inicio"])
        reformatted_data[asignatura_id]["Seminarios"]["Fin"].append(entry["Fin"])
        reformatted_data[asignatura_id]["Seminarios"]["Aula"].append(entry["Aula"])

# Save the reformatted data to a new JSON file
with open('data.json', 'w') as file:
    json.dump(reformatted_data, file, ensure_ascii=False, indent=2)