"""
Copies all the images in the subfolders
This is just used for testing purposes
"""

import os
import shutil


def get_subfolders(directory):
    return [f.path for f in os.scandir(directory) if f.is_dir()]


def run():
    for folder in get_subfolders('.'):
        print(f"Going into {folder}")
        f = os.listdir(folder)[0]
        print(f"Found {f}, duplicating it")
        for i in range(100):
            dst_file = f.replace('.png', '_%03d.png' % i)
            shutil.copyfile(os.path.join(folder, f),
                            os.path.join(folder, dst_file))

    print("Done")


if __name__ == "__main__":
    run()
