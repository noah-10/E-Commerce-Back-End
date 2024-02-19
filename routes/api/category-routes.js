const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories with its associated Products
  try{
    const allCategories = await Category.findAll( {
      include: {model: Product}
    });

    res.json(allCategories);
  }catch(err){
    res.json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value including its associated Products
  try {
    const categoryInfo = await Category.findByPk(req.params.id,{
      include: {model: Product}
    })

    //if id doesn't have a category
    if(!categoryInfo){
      res.status(404).json({message: "No category with this id!"});
      return;
    }

    res.json(categoryInfo);
  }catch(err){
    res.json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try{
    const newCategory = await Category.create(req.body);
    res.json(newCategory);
  }catch (err){
    res.json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try{
    const updatedCategory = await Category.update(
      {
        category_name: req.body.category_name,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    )

    if(!updatedCategory){
      res.status(404).json({message: "No category with this id!"})
    }

    res.json(updatedCategory);
  }catch(err){
    res.json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try{
    const deleteCategory = await Category.destroy({
      where: {
        id: req.params.id
      }
    });

    if(!deleteCategory){
      res.status(404).json({message: "No category with this id!"})
    }

    res.json(deleteCategory);
  }catch(err){
    res.json(err);
  }
});

module.exports = router;
