import os


def get_files(dir_path):
    return [f for f in os.listdir(dir_path) if os.path.isfile(os.path.join(dir_path, f))]


def remove_ext(filename):
    return filename.split('.')[0]


def load_techs():
    techs_dir = "assets/tech"
    return set([remove_ext(f).split('_')[0] for f in get_files(techs_dir)])


def load_materials():
    materials_dir = "assets/badge"
    return set([remove_ext(f) for f in get_files(materials_dir)])
