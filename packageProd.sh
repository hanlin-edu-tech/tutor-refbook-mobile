#!/bin/bash

echo "<< package >>"
gulp package

echo "<< upload to Gcs Prod >>"
gulp uploadGcsProd