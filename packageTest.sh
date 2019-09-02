#!/bin/bash

echo "<< package >>"
gulp package

echo "<< upload to Gcs Test >>"
gulp uploadGcsTest